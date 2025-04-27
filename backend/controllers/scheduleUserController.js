// controllers/registrationController.js
import ClassRegistration from "../models/ScheduleUser.js";
import Schedule from "../models/Schedule.js"; // file Schedule bạn cũng cần sửa thành import/export nhé

// Đăng ký lớp tập
export const registerClass = async (req, res) => {
  try {
    const { userId, scheduleId } = req.body;

    if (!userId || !scheduleId) {
      return res.status(400).json({ message: "Thiếu userId hoặc scheduleId." });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Không tìm thấy lớp học." });
    }

    const existing = await ClassRegistration.findOne({ userId, scheduleId });
    if (existing) {
      return res.status(400).json({ message: "Bạn đã đăng ký lớp này rồi." });
    }

    const newRegistration = new ClassRegistration({ userId, scheduleId });
    await newRegistration.save();

    res.status(201).json({
      message: "Đăng ký thành công!",
      registration: newRegistration,
    });
  } catch (error) {
    console.error("Lỗi đăng ký lớp:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy danh sách lớp đã đăng ký
export const getUserRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;

    const registrations = await ClassRegistration.find({ userId })
      .populate("scheduleId")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Lỗi lấy đăng ký lớp:", error);
    res.status(500).json({ message: "Server error" });
  }
};
