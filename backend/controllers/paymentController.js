import Payment from "../models/Payment.js";
import mongoose from "mongoose";
import Membership from "../models/Membership.js";

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    // Log request body for debugging
    console.log("Payment request data:", req.body);

    // Get data from request body
    const { amount, method, registrationIds, status, paymentType } = req.body;

    // Use the userId from the request object (set by the auth middleware)
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    if (
      !registrationIds ||
      !Array.isArray(registrationIds) ||
      registrationIds.length === 0
    ) {
      return res.status(400).json({ message: "Registration IDs are required" });
    }

    // Validate each registration ID - for each ID, check if it's a valid class registration OR membership
    for (const regId of registrationIds) {
      try {
        // First try to find it as a class registration
        const classReg = await ClassRegistration.findById(regId);
        if (classReg) {
          // Validate that this registration belongs to the current user
          if (classReg.user.toString() !== userId) {
            return res.status(403).json({
              message: "You are not authorized to pay for this registration",
            });
          }
          continue; // Skip to next ID after successful validation
        }

        // If not a class registration, try as a membership
        const membership = await Membership.findById(regId);
        if (membership) {
          // Validate that this membership belongs to the current user
          if (membership.user.toString() !== userId) {
            return res.status(403).json({
              message: "You are not authorized to pay for this membership",
            });
          }
          continue; // Skip to next ID after successful validation
        }

        // If we get here, the ID is neither a valid class registration nor membership
        return res.status(400).json({
          message: `Invalid registration ID: ${regId}. Not found in class registrations or memberships.`,
        });
      } catch (err) {
        console.error(`Error validating registration ID ${regId}:`, err);
        return res.status(400).json({
          message: `Invalid registration ID format: ${regId}`,
        });
      }
    }

    // Create payment record
    const payment = new Payment({
      user: userId,
      amount,
      method,
      registrationIds,
      status: status || "pending",
      paymentType: paymentType || "class",
    });

    // Save payment
    const savedPayment = await payment.save();

    // If we're saving a membership payment, also update the pending payment reference
    if (
      paymentType === "membership" ||
      paymentType === "membership_upgrade" ||
      paymentType === "membership_and_class"
    ) {
      // Find membership IDs in the payment
      const membershipIds = [];
      for (const regId of registrationIds) {
        const membership = await Membership.findById(regId);
        if (membership) {
          membershipIds.push(regId);

          // Update the membership with pending payment reference
          membership.pendingPaymentId = savedPayment._id;
          await membership.save();
        }
      }

      console.log(
        `Updated ${membershipIds.length} memberships with pending payment reference`
      );
    }

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      message: "Could not create payment",
      error: error.message,
    });
  }
};

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const userId = req.userId;

    // Find payments for the current user
    const payments = await Payment.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error getting payments:", error);
    res.status(500).json({
      message: "Cannot fetch payments",
      error: error.message,
    });
  }
};

// Get all payments (admin)
export const getAllPayments = async (req, res) => {
  try {
    // Admin endpoint to get all payments
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .populate("user", "username email");

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error getting all payments:", error);
    res.status(500).json({
      message: "Cannot fetch payments",
      error: error.message,
    });
  }
};

// Update the approvePayment function
export const approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    console.log(`Approving payment ${paymentId}`);

    // 1. Find the payment
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "completed") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    // Verify payment contents before processing
    const paymentVerification = await verifyPaymentContents(payment);
    console.log("Payment verification results:", paymentVerification);

    if (!paymentVerification.valid) {
      console.warn(
        "Payment contains invalid items:",
        paymentVerification.invalidItems
      );
    }

    // Log the registration IDs that we're about to update
    console.log(`Processing payment for user: ${payment.user}`);
    console.log(`Payment type: ${payment.paymentType}`);
    console.log(`Payment amount: ${payment.amount}`);
    console.log(
      `Registration IDs to update: ${payment.registrationIds.length} items`
    );
    console.log(payment.registrationIds);

    // Update payment status
    payment.status = "completed";
    payment.completedAt = new Date();
    await payment.save();

    // 2. Update ONLY the registrations in the payment's registrationIds
    let updatedCount = 0;
    let failedCount = 0;

    if (payment.registrationIds && payment.registrationIds.length > 0) {
      // For each registration ID, update its payment status
      for (const regId of payment.registrationIds) {
        try {
          // First try to find it as a class registration
          const registration = await ClassRegistration.findById(regId);
          if (registration) {
            console.log(
              `✓ Updating class registration ${regId} payment status (${registration.schedule})`
            );
            registration.paymentStatus = true;
            await registration.save();
            updatedCount++;
            continue; // Skip to next ID after successful update
          }

          // If not a class registration, try as a membership
          const membership = await Membership.findById(regId);
          if (membership) {
            console.log(
              `✓ Updating membership ${regId} payment status for user ${membership.user}`
            );
            membership.paymentStatus = true;
            // If it was pending_payment, change to active
            if (membership.status === "pending_payment") {
              membership.status = "active";
              console.log(
                `  Changed membership status from pending_payment to active`
              );
            }
            await membership.save();
            updatedCount++;
            continue;
          }

          console.log(
            `✗ Could not find registration or membership with ID: ${regId}`
          );
          failedCount++;
        } catch (err) {
          console.error(
            `✗ Error updating registration/membership ${regId}:`,
            err
          );
          failedCount++;
        }
      }
    }

    console.log(
      `Payment approval complete - Updated: ${updatedCount}, Failed: ${failedCount}`
    );

    res.status(200).json({
      message: "Payment approved successfully",
      payment,
      stats: {
        totalItems: payment.registrationIds.length,
        updatedCount,
        failedCount,
      },
    });
  } catch (error) {
    console.error("Error approving payment:", error);
    res.status(500).json({
      message: "Could not approve payment",
      error: error.message,
    });
  }
};

// Add or update the getPaymentDetails function

export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Find the payment
    const payment = await Payment.findById(paymentId).populate(
      "user",
      "username email"
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Prepare result container
    const result = {
      paymentId: payment._id,
      items: [],
      totalItems: payment.registrationIds.length,
      totalAmount: payment.amount,
    };

    // Process each registration ID
    for (const regId of payment.registrationIds) {
      try {
        // Try to find as class registration first
        let classReg = await ClassRegistration.findById(regId)
          .populate("schedule", "className day time price")
          .populate("user", "username email");

        if (classReg) {
          result.items.push({
            id: regId,
            type: "class",
            name: classReg.schedule?.className || "Lớp học",
            scheduleInfo: classReg.schedule?.time
              ? `${classReg.schedule.day} ${classReg.schedule.time}`
              : undefined,
            price: classReg.schedule?.price || 0,
            userId: classReg.user?._id,
          });
          continue;
        }

        // If not found, try as membership
        let membership = await Membership.findById(regId).populate(
          "user",
          "username email"
        );

        if (membership) {
          // Format membership type for better display
          let membershipName = "Gói ";
          switch (membership.type) {
            case "basic":
              membershipName += "Cơ bản";
              break;
            case "standard":
              membershipName += "Tiêu chuẩn";
              break;
            case "premium":
              membershipName += "Cao cấp";
              break;
            case "vip":
              membershipName += "VIP";
              break;
            default:
              membershipName += membership.type;
          }

          result.items.push({
            id: regId,
            type: "membership",
            name: membershipName,
            duration: membership.endDate
              ? `Hết hạn: ${new Date(membership.endDate).toLocaleDateString(
                  "vi-VN"
                )}`
              : undefined,
            price: membership.price || 0,
            userId: membership.user?._id,
          });
          continue;
        }

        // If neither, add as unknown
        result.items.push({
          id: regId,
          type: "unknown",
          name: `ID: ${regId.substring(regId.length - 6)}`,
          price: 0,
        });
      } catch (err) {
        console.error(`Error processing registration ID ${regId}:`, err);
        result.items.push({
          id: regId,
          type: "error",
          name: `Lỗi xử lý ID: ${regId.substring(regId.length - 6)}`,
          price: 0,
        });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting payment details:", error);
    res.status(500).json({
      message: "Không thể lấy chi tiết thanh toán",
      error: error.message,
    });
  }
};

// Cancel payment
export const cancelPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paymentId } = req.params;

    // Find the payment
    const payment = await Payment.findById(paymentId).session(session);

    if (!payment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "completed") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Cannot cancel completed payment" });
    }

    // Update payment status
    payment.status = "cancelled";
    await payment.save({ session });

    // Process all registration IDs
    const { registrationIds } = payment;

    for (const regId of registrationIds) {
      // Check if this is a membership payment
      const membership = await Membership.findById(regId).session(session);

      if (membership) {
        // If payment was for a membership, update its status
        if (membership.status === "pending_payment") {
          membership.status = "cancelled";
          await membership.save({ session });
        }
      }

      // Add other registration types handling here if needed
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Payment cancelled successfully",
      payment,
    });
  } catch (error) {
    console.error("Error cancelling payment:", error);
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: "Cannot cancel payment",
      error: error.message,
    });
  }
};

// Add/update the getPendingPayments function

// Get pending payments (Admin only)
export const getPendingPayments = async (req, res) => {
  try {
    console.log("Fetching pending payments");

    // Find all payments with status "pending"
    const pendingPayments = await Payment.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("user", "username email");

    console.log(`Found ${pendingPayments.length} pending payments`);

    res.status(200).json(pendingPayments);
  } catch (error) {
    console.error("Error getting pending payments:", error);
    res.status(500).json({
      message: "Cannot fetch pending payments",
      error: error.message,
    });
  }
};

// Add the rejectPayment function
export const rejectPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    // Find the payment
    const payment = await Payment.findById(paymentId).session(session);

    if (!payment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "completed") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Cannot reject completed payment" });
    }

    // Update payment status and add rejection reason
    payment.status = "cancelled";
    payment.rejectionReason = reason || "Rejected by admin";
    await payment.save({ session });

    // Process all registration IDs
    const { registrationIds } = payment;

    for (const regId of registrationIds) {
      // Check if this is a membership payment
      const membership = await Membership.findById(regId).session(session);

      if (membership) {
        // If payment was for a membership, update its status
        if (membership.status === "pending_payment") {
          membership.status = "cancelled";
          membership.statusNote = reason || "Payment rejected by admin";
          await membership.save({ session });
        }
      }

      // Check if this is a class registration
      const registration = await ClassRegistration.findById(regId).session(
        session
      );
      if (registration) {
        // Add a note about the rejection reason
        registration.notes = registration.notes || [];
        registration.notes.push({
          text: `Payment rejected: ${reason || "No reason provided"}`,
          date: new Date(),
        });
        await registration.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Payment rejected successfully",
      payment,
    });
  } catch (error) {
    console.error("Error rejecting payment:", error);
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: "Cannot reject payment",
      error: error.message,
    });
  }
};

// Add this new controller function

// Update payment to add class registrations
export const updatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, additionalRegistrationIds, paymentType } = req.body;
    const userId = req.userId;

    // Verify payment belongs to the user
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to payment" });
    }

    if (payment.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot update a non-pending payment" });
    }

    // Update the payment with additional registrations
    if (additionalRegistrationIds && additionalRegistrationIds.length > 0) {
      // Add only unique registration IDs
      const uniqueRegIds = [
        ...new Set([
          ...payment.registrationIds.map((id) => id.toString()),
          ...additionalRegistrationIds,
        ]),
      ];

      payment.registrationIds = uniqueRegIds;
    }

    // Update amount if provided
    if (amount) {
      payment.amount = amount;
    }

    // Update payment type if provided
    if (paymentType) {
      payment.paymentType = paymentType;
    }

    // Save the updated payment
    await payment.save();

    res.status(200).json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({
      message: "Cannot update payment",
      error: error.message,
    });
  }
};

// Add this function to validate payment contents before approval

// Utility function to verify payment contents
const verifyPaymentContents = async (payment) => {
  const results = {
    valid: true,
    details: [],
    invalidItems: [],
  };

  for (const regId of payment.registrationIds) {
    // Check if it's a valid class registration
    const registration = await ClassRegistration.findById(regId);
    if (registration) {
      results.details.push({
        type: "class",
        id: regId,
        valid: true,
        userId: registration.user,
      });
      continue;
    }

    // Check if it's a valid membership
    const membership = await Membership.findById(regId);
    if (membership) {
      results.details.push({
        type: "membership",
        id: regId,
        valid: true,
        userId: membership.user,
      });
      continue;
    }

    // If we get here, the item is invalid
    results.valid = false;
    results.invalidItems.push(regId);
    results.details.push({
      type: "unknown",
      id: regId,
      valid: false,
      userId: null,
    });
  }

  return results;
};

// Add these controller functions

// Get rejected payments
export const getRejectedPayments = async (req, res) => {
  try {
    // Find payments with status "cancelled"
    const rejectedPayments = await Payment.find({ status: "cancelled" })
      .sort({ updatedAt: -1 })
      .populate("user", "username email");

    res.status(200).json(rejectedPayments);
  } catch (error) {
    console.error("Error getting rejected payments:", error);
    res.status(500).json({
      message: "Cannot fetch rejected payments",
      error: error.message,
    });
  }
};

// Delete payment permanently
export const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Find the payment first to make sure it exists
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Only allow deleting rejected payments
    if (payment.status !== "cancelled") {
      return res.status(400).json({
        message: "Only rejected payments can be deleted",
      });
    }

    // Delete the payment
    await Payment.findByIdAndDelete(paymentId);

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({
      message: "Could not delete payment",
      error: error.message,
    });
  }
};

// Add this controller function

// Get completed payments
export const getCompletedPayments = async (req, res) => {
  try {
    // Find payments with status "completed"
    const completedPayments = await Payment.find({ status: "completed" })
      .sort({ completedAt: -1 })
      .populate("user", "username email");

    res.status(200).json(completedPayments);
  } catch (error) {
    console.error("Error getting completed payments:", error);
    res.status(500).json({
      message: "Cannot fetch completed payments",
      error: error.message,
    });
  }
};

// Add an endpoint to update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    // Validate the requested status
    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update the payment status
    payment.status = status;

    // If changing to completed, set completedAt
    if (status === "completed" && !payment.completedAt) {
      payment.completedAt = new Date();
    }

    await payment.save();

    res.status(200).json({
      message: "Payment status updated successfully",
      payment,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      message: "Could not update payment status",
      error: error.message,
    });
  }
};
