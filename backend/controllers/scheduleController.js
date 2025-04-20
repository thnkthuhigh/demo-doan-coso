import Schedule from "../models/Schedule.js";

// Tạo lịch mới
export const createSchedule = async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả lịch
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sửa lịch
export const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa lịch
export const deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa lịch" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
