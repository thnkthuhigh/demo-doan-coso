import Attendance from "../models/Attendance.js";
import ClassEnrollment from "../models/ClassEnrollment.js";
import Class from "../models/Class.js";
import mongoose from "mongoose";

// Tạo buổi học mới
export const createSession = async (req, res) => {
  try {
    const { classId, sessionNumber, sessionDate, instructorId } = req.body;

    // Kiểm tra lớp học tồn tại
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: "Lớp học không tồn tại" });
    }

    // Kiểm tra session đã tồn tại chưa
    const existingSession = await Attendance.findOne({
      class: classId,
      sessionNumber,
    });

    if (existingSession) {
      return res.status(400).json({ message: "Buổi học này đã tồn tại" });
    }

    // Lấy danh sách học viên đã đăng ký
    const enrollments = await ClassEnrollment.find({
      class: classId,
      status: "active",
    });

    const attendance = new Attendance({
      class: classId,
      sessionNumber,
      sessionDate,
      instructor: instructorId,
      totalEnrolled: enrollments.length,
    });

    await attendance.save();
    await attendance.populate("class", "className");

    res.status(201).json(attendance);
  } catch (error) {
    console.error("Error creating session:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo buổi học", error: error.message });
  }
};

// Điểm danh học viên
export const markAttendance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { attendanceId, userId, note } = req.body;

    // Tìm buổi học
    const attendance = await Attendance.findById(attendanceId).session(session);
    if (!attendance) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Buổi học không tồn tại" });
    }

    // Kiểm tra học viên có đăng ký lớp này không
    const enrollment = await ClassEnrollment.findOne({
      user: userId,
      class: attendance.class,
      status: "active",
    }).session(session);

    if (!enrollment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Học viên chưa đăng ký lớp này" });
    }

    // Kiểm tra đã điểm danh chưa
    const existingAttendee = attendance.attendees.find(
      (attendee) => attendee.user.toString() === userId
    );

    if (existingAttendee) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Học viên đã được điểm danh rồi" });
    }

    // Thêm điểm danh
    attendance.attendees.push({
      user: userId,
      enrollment: enrollment._id,
      note,
    });

    attendance.totalPresent = attendance.attendees.length;
    await attendance.save({ session });

    // Cập nhật attendance record trong enrollment
    enrollment.attendanceRecord.push({
      sessionNumber: attendance.sessionNumber,
      date: attendance.sessionDate,
      attended: true,
      note,
    });

    // Giảm số buổi còn lại
    if (enrollment.remainingSessions > 0) {
      enrollment.remainingSessions -= 1;
    }

    await enrollment.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Điểm danh thành công",
      attendance,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error marking attendance:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi điểm danh", error: error.message });
  }
};

// Lấy danh sách điểm danh của lớp
export const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { sessionNumber } = req.query;

    const filter = { class: classId };
    if (sessionNumber) filter.sessionNumber = parseInt(sessionNumber);

    const attendanceRecords = await Attendance.find(filter)
      .populate({
        path: "attendees.user",
        select: "username email phone",
      })
      .populate("instructor", "username")
      .sort({ sessionNumber: 1 });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách điểm danh",
      error: error.message,
    });
  }
};

// Lấy báo cáo tham gia của học viên
export const getUserAttendanceReport = async (req, res) => {
  try {
    const { userId, classId } = req.params;

    const enrollment = await ClassEnrollment.findOne({
      user: userId,
      class: classId,
    }).populate("class", "className totalSessions");

    if (!enrollment) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đăng ký lớp học" });
    }

    const totalAttended = enrollment.attendanceRecord.filter(
      (record) => record.attended
    ).length;

    const attendanceRate =
      enrollment.class.totalSessions > 0
        ? ((totalAttended / enrollment.class.totalSessions) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      enrollment,
      totalAttended,
      totalSessions: enrollment.class.totalSessions,
      remainingSessions: enrollment.remainingSessions,
      attendanceRate: parseFloat(attendanceRate),
      attendanceRecord: enrollment.attendanceRecord,
    });
  } catch (error) {
    console.error("Error fetching user attendance report:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy báo cáo tham gia", error: error.message });
  }
};
