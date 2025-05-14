import Payment from "../models/Payment.js";
import ClassRegistration from "../models/ClassRegistration.js";
import mongoose from "mongoose";

// Tạo thanh toán mới
export const createPayment = async (req, res) => {
  try {
    const { amount, method, registrationIds, status } = req.body;
    const userId = req.user.userId; // Lấy userId từ token đã xác thực

    if (!amount || !method || !registrationIds) {
      return res.status(400).json({
        message: "Thiếu thông tin cần thiết cho thanh toán",
      });
    }

    const payment = await Payment.create({
      user: userId,
      amount,
      method,
      registrationIds,
      status: status || "pending",
    });

    return res.status(201).json({
      message: "Đã tạo thanh toán thành công",
      payment,
    });
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error);
    return res.status(500).json({
      message: "Không thể tạo thanh toán",
      error: error.message,
    });
  }
};

// Lấy danh sách thanh toán theo người dùng
export const getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra quyền truy cập (chỉ user đó hoặc admin mới có thể xem)
    if (req.user.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const payments = await Payment.find({ user: userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json({
      message: "Không thể lấy danh sách thanh toán",
      error: error.message,
    });
  }
};

// Lấy tất cả thanh toán đang chờ xác nhận (cho admin)
export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" })
      .populate("user", "username email phone")
      .sort({ createdAt: -1 });
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json({
      message: "Không thể lấy danh sách thanh toán",
      error: error.message,
    });
  }
};

// Admin xác nhận thanh toán
export const approvePayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paymentId } = req.params;
    const adminId = req.user.userId; // Lấy ID admin từ token

    // Tìm thông tin thanh toán
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    }

    if (payment.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Thanh toán này đã được xử lý rồi" });
    }

    // Cập nhật trạng thái thanh toán
    payment.status = "approved";
    payment.approvedBy = adminId;
    payment.approvedAt = new Date();
    await payment.save({ session });

    // Cập nhật tất cả đăng ký liên quan
    if (payment.registrationIds && payment.registrationIds.length > 0) {
      await ClassRegistration.updateMany(
        { _id: { $in: payment.registrationIds } },
        { paymentStatus: true },
        { session }
      );
    }

    await session.commitTransaction();

    return res.status(200).json({
      message: "Đã xác nhận thanh toán thành công",
      payment,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Lỗi khi xác nhận thanh toán:", error);
    return res.status(500).json({
      message: "Không thể xác nhận thanh toán",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Từ chối thanh toán
export const rejectPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    }

    if (payment.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Thanh toán này đã được xử lý rồi" });
    }

    payment.status = "rejected";
    payment.reason = reason;
    payment.rejectedBy = req.user.userId;
    payment.rejectedAt = new Date();
    await payment.save();

    return res.status(200).json({
      message: "Đã từ chối thanh toán",
      payment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Không thể từ chối thanh toán",
      error: error.message,
    });
  }
};
