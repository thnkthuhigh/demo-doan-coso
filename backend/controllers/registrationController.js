import ClassRegistration from "../models/ClassRegistration.js";
import mongoose from "mongoose";

export const registerClass = async (req, res) => {
  try {
    const { userId, scheduleId } = req.body;
    if (!userId || !scheduleId) {
      return res.status(400).json({ message: "Thiếu userId hoặc scheduleId." });
    }

    const existed = await ClassRegistration.findOne({
      user: new mongoose.Types.ObjectId(userId),
      schedule: new mongoose.Types.ObjectId(scheduleId),
    });

    if (existed) {
      return res.status(400).json({ message: "Bạn đã đăng ký lịch này rồi." });
    }

    const registration = await ClassRegistration.create({
      user: new mongoose.Types.ObjectId(userId),
      schedule: new mongoose.Types.ObjectId(scheduleId),
    });

    return res.status(201).json(registration);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đăng ký thất bại.", error: error.message });
  }
};

export const getRegistrationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const registrations = await ClassRegistration.find({
      user: userId,
    }).populate("schedule");
    return res.status(200).json(registrations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Thêm hàm xóa đăng ký lớp học
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra id hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    // Tìm và xóa đăng ký
    const deletedRegistration = await ClassRegistration.findByIdAndDelete(id);

    // Nếu không tìm thấy đăng ký
    if (!deletedRegistration) {
      return res.status(404).json({ message: "Không tìm thấy đăng ký này" });
    }

    return res.status(200).json({ message: "Đã xóa đăng ký thành công" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lỗi khi xóa đăng ký", error: error.message });
  }
};
