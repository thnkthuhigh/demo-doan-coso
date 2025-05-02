import User from "../models/User.js";

// Lấy thông tin user theo ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username email gender dob phone"
    );
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user." });
    }
    res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy user:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};
