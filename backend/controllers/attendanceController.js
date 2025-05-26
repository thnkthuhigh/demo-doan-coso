import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";
import ClassEnrollment from "../models/ClassEnrollment.js";

// Tạo session attendance cho một lớp
export const createSessionAttendance = async (req, res) => {
  try {
    const { classId, sessionNumber, sessionDate } = req.body;

    // Lấy danh sách học viên đã đăng ký
    const enrollments = await ClassEnrollment.find({ class: classId }).populate(
      "user",
      "username email"
    );

    if (!enrollments.length) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy học viên nào trong lớp" });
    }

    // Tạo attendance records cho tất cả học viên
    const attendancePromises = enrollments.map((enrollment) => {
      return Attendance.findOneAndUpdate(
        {
          classId,
          userId: enrollment.user._id,
          sessionNumber,
        },
        {
          classId,
          userId: enrollment.user._id,
          sessionNumber,
          sessionDate: new Date(sessionDate),
          isPresent: false,
        },
        {
          upsert: true,
          new: true,
        }
      );
    });

    await Promise.all(attendancePromises);

    res.json({ message: "Tạo session điểm danh thành công" });
  } catch (error) {
    console.error("Error creating session attendance:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo session điểm danh", error: error.message });
  }
};

// Điểm danh cho học viên
export const markAttendance = async (req, res) => {
  try {
    const { classId, userId, sessionNumber, isPresent, notes } = req.body;
    const markedBy = req.user.id;

    const attendance = await Attendance.findOneAndUpdate(
      { classId, userId, sessionNumber },
      {
        isPresent,
        checkinTime: isPresent ? new Date() : null,
        notes: notes || "",
        markedBy,
      },
      { new: true }
    ).populate("userId", "username email");

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản ghi điểm danh" });
    }

    res.json({
      message: "Điểm danh thành công",
      attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi điểm danh", error: error.message });
  }
};

// Lấy danh sách điểm danh cho một session
export const getSessionAttendance = async (req, res) => {
  try {
    const { classId, sessionNumber } = req.params;

    const attendanceList = await Attendance.find({ classId, sessionNumber })
      .populate("userId", "username email phone")
      .populate("markedBy", "username")
      .sort({ "userId.username": 1 });

    res.json(attendanceList);
  } catch (error) {
    console.error("Error fetching session attendance:", error);
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách điểm danh",
        error: error.message,
      });
  }
};

// Lấy báo cáo điểm danh của user
export const getUserAttendanceReport = async (req, res) => {
  try {
    const { userId } = req.params;

    const attendanceRecords = await Attendance.find({ userId })
      .populate("classId", "className serviceName schedule")
      .sort({ sessionDate: -1 });

    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.json({
        attendanceRecords: [],
        totalSessions: 0,
        attendedSessions: 0,
        missedSessions: 0,
        attendanceRate: 0,
      });
    }

    const totalSessions = attendanceRecords.length;
    const attendedSessions = attendanceRecords.filter(
      (record) => record.isPresent
    ).length;
    const missedSessions = totalSessions - attendedSessions;
    const attendanceRate =
      totalSessions > 0
        ? ((attendedSessions / totalSessions) * 100).toFixed(1)
        : 0;

    res.json({
      attendanceRecords,
      totalSessions,
      attendedSessions,
      missedSessions,
      attendanceRate,
    });
  } catch (error) {
    console.error("Error fetching user attendance report:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy báo cáo điểm danh", error: error.message });
  }
};

// Lấy báo cáo điểm danh cho một lớp
export const getClassAttendanceReport = async (req, res) => {
  try {
    const { classId } = req.params;

    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ message: "Không tìm thấy lớp học" });
    }

    // Lấy tất cả attendance records của lớp
    const attendanceRecords = await Attendance.find({ classId })
      .populate("userId", "username email")
      .sort({ sessionNumber: 1, "userId.username": 1 });

    // Group by session
    const sessionData = {};
    attendanceRecords.forEach((record) => {
      if (!sessionData[record.sessionNumber]) {
        sessionData[record.sessionNumber] = {
          sessionNumber: record.sessionNumber,
          sessionDate: record.sessionDate,
          attendees: [],
          totalStudents: 0,
          presentCount: 0,
        };
      }

      sessionData[record.sessionNumber].attendees.push(record);
      sessionData[record.sessionNumber].totalStudents++;
      if (record.isPresent) {
        sessionData[record.sessionNumber].presentCount++;
      }
    });

    const sessions = Object.values(sessionData).sort(
      (a, b) => a.sessionNumber - b.sessionNumber
    );

    res.json({
      classInfo,
      sessions,
      totalSessions: sessions.length,
    });
  } catch (error) {
    console.error("Error fetching class attendance report:", error);
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy báo cáo điểm danh lớp",
        error: error.message,
      });
  }
};

// Update class session và status
export const updateClassSession = async (req, res) => {
  try {
    const { classId } = req.params;
    const { currentSession } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { currentSession },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Không tìm thấy lớp học" });
    }

    res.json({
      message: "Cập nhật session thành công",
      class: updatedClass,
    });
  } catch (error) {
    console.error("Error updating class session:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật session", error: error.message });
  }
};
