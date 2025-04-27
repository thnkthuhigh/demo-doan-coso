import Schedule from "../models/Schedule.js";

// Tạo lịch học mới
export const createSchedule = async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error("Lỗi tạo lịch:", error);
    res.status(400).json({ message: error.message });
  }
};

// Lấy tất cả lịch học
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Lỗi lấy danh sách lịch:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật lịch học
export const updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSchedule) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch cần cập nhật." });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error("Lỗi cập nhật lịch:", error);
    res.status(400).json({ message: error.message });
  }
};

// Xóa lịch học
export const deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch cần xóa." });
    }
    res.status(200).json({ message: "Đã xóa lịch thành công!" });
  } catch (error) {
    console.error("Lỗi xóa lịch:", error);
    res.status(500).json({ message: error.message });
  }
};
