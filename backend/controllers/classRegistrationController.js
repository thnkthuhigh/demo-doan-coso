import ClassRegistration from "../models/ClassRegistration.js";

// Đăng ký lịch tập
export const registerClass = async (req, res) => {
  try {
    const { userId, scheduleId } = req.body;
    const registration = new ClassRegistration({
      user: userId,
      schedule: scheduleId,
    });
    await registration.save();
    res.status(201).json({ message: "Đăng ký thành công!", registration });
  } catch (error) {
    console.error("❌ Lỗi đăng ký lịch:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thanh toán đăng ký
export const payForClass = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await ClassRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: "Không tìm thấy đăng ký." });
    }
    registration.paymentStatus = true;
    await registration.save();
    res.json({ message: "Thanh toán thành công!", registration });
  } catch (error) {
    console.error("❌ Lỗi thanh toán:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy đăng ký của user
export const getUserRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;
    const registrations = await ClassRegistration.find({
      user: userId,
    }).populate("schedule");
    res.json(registrations);
  } catch (error) {
    console.error("❌ Lỗi lấy đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy tất cả đăng ký (Admin)
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await ClassRegistration.find().populate(
      "user schedule"
    );
    res.json(registrations);
  } catch (error) {
    console.error("❌ Lỗi lấy tất cả đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
