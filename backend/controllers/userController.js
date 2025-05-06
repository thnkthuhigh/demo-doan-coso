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

// Cập nhật thông tin user
export const updateUserById = async (req, res) => {
  try {
    const { username, email, phone, dob, gender } = req.body;

    // Kiểm tra user tồn tại
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user." });
    }

    // Cập nhật trường hợp có dữ liệu mới
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;

    // Lưu lại vào database
    await user.save();

    // Trả về dữ liệu đã cập nhật (không bao gồm password)
    const updatedUser = await User.findById(user._id).select(
      "username email phone dob gender"
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin." });
  }
};
