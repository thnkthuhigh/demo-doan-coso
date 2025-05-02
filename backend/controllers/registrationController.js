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
