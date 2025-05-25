import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Lấy thông tin user theo ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username email gender dob phone fullName address"
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
    const { username, email, phone, dob, gender, fullName, address } = req.body;

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
    user.fullName = fullName || user.fullName;
    user.address = address || user.address;

    // Lưu lại vào database
    await user.save();

    // Trả về dữ liệu đã cập nhật (không bao gồm password)
    const updatedUser = await User.findById(user._id).select(
      "username email phone dob gender fullName address"
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin." });
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Giả sử bạn có middleware thêm user vào req

    // Tìm user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user." });
    }

    // Xác thực mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword; // Sẽ được băm bởi pre-save hook
    await user.save();

    return res
      .status(200)
      .json({ message: "Đã cập nhật mật khẩu thành công." });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
