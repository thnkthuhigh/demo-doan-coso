import Class from "../models/Class.js";
import ClassEnrollment from "../models/ClassEnrollment.js";
import Attendance from "../models/Attendance.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Lấy tất cả lớp học
export const getAllClasses = async (req, res) => {
  try {
    const { status, service, instructor, available } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (service) filter.serviceName = service;
    if (instructor)
      filter.instructorName = { $regex: instructor, $options: "i" };
    if (available === "true") {
      filter.$expr = { $lt: ["$currentMembers", "$maxMembers"] };
    }

    const classes = await Class.find(filter)
      .populate("service", "name image")
      .populate("instructor", "username email")
      .sort({ startDate: 1 });

    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách lớp học", error: error.message });
  }
};

// Tạo lớp học mới
export const createClass = async (req, res) => {
  try {
    const {
      className,
      serviceId,
      serviceName,
      instructorId,
      instructorName,
      description,
      maxMembers,
      totalSessions,
      price,
      startDate,
      endDate,
      schedule,
      location,
      requirements,
      image,
    } = req.body;

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Dịch vụ không tồn tại" });
    }

    // Validate instructor if provided
    if (instructorId) {
      const instructor = await User.findById(instructorId);
      if (!instructor) {
        return res
          .status(404)
          .json({ message: "Huấn luyện viên không tồn tại" });
      }
    }

    const newClass = new Class({
      className,
      service: serviceId,
      serviceName,
      instructor: instructorId,
      instructorName,
      description,
      maxMembers,
      totalSessions,
      price,
      startDate,
      endDate,
      schedule,
      location,
      requirements,
      image,
    });

    await newClass.save();
    await newClass.populate("service", "name image");

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo lớp học", error: error.message });
  }
};

// Cập nhật lớp học
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedClass = await Class.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("service", "name image");

    if (!updatedClass) {
      return res.status(404).json({ message: "Không tìm thấy lớp học" });
    }

    res.status(200).json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật lớp học", error: error.message });
  }
};

// Xóa lớp học
export const deleteClass = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Kiểm tra xem có học viên đã đăng ký chưa
    const enrollmentCount = await ClassEnrollment.countDocuments({ class: id });
    if (enrollmentCount > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Không thể xóa lớp học đã có học viên đăng ký",
      });
    }

    // Xóa lớp học
    const deletedClass = await Class.findByIdAndDelete(id).session(session);
    if (!deletedClass) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Không tìm thấy lớp học" });
    }

    // Xóa các attendance records liên quan
    await Attendance.deleteMany({ class: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Xóa lớp học thành công" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting class:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi xóa lớp học", error: error.message });
  }
};

// Đăng ký lớp học
export const enrollClass = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { classId, userId } = req.body;

    // Kiểm tra lớp học tồn tại
    const classDoc = await Class.findById(classId).session(session);
    if (!classDoc) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Lớp học không tồn tại" });
    }

    // Kiểm tra còn chỗ trống
    if (classDoc.currentMembers >= classDoc.maxMembers) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Lớp học đã đầy" });
    }

    // Kiểm tra user đã đăng ký chưa
    const existingEnrollment = await ClassEnrollment.findOne({
      user: userId,
      class: classId,
    }).session(session);

    if (existingEnrollment) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Bạn đã đăng ký lớp học này rồi" });
    }

    // Tạo đăng ký mới
    const enrollment = new ClassEnrollment({
      user: userId,
      class: classId,
      remainingSessions: classDoc.totalSessions,
    });

    await enrollment.save({ session });

    // Cập nhật số lượng thành viên trong lớp
    await Class.findByIdAndUpdate(
      classId,
      { $inc: { currentMembers: 1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Đăng ký lớp học thành công",
      enrollment,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error enrolling class:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi đăng ký lớp học", error: error.message });
  }
};

// Lấy danh sách học viên của lớp
export const getClassMembers = async (req, res) => {
  try {
    const { classId } = req.params;

    const enrollments = await ClassEnrollment.find({ class: classId })
      .populate("user", "username email phone")
      .populate("class", "className")
      .sort({ enrollmentDate: -1 });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching class members:", error);
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách học viên",
        error: error.message,
      });
  }
};

// Lấy lớp học của user
export const getUserClasses = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const enrollments = await ClassEnrollment.find(filter)
      .populate({
        path: "class",
        populate: {
          path: "service",
          select: "name image",
        },
      })
      .sort({ enrollmentDate: -1 });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching user classes:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy lớp học của user", error: error.message });
  }
};
