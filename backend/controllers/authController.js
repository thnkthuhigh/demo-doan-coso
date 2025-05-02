import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { username, email, phone, password, dob, gender } = req.body;

    if (!username || !email || !phone || !password || !dob || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedUsername = username.trim();
    const trimmedPhone = phone.trim();

    // Check trùng email, username hoặc phone
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: trimmedUsername },
        { phone: trimmedPhone },
      ],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email, username hoặc phone đã tồn tại!" });
    }

    const newUser = new User({
      username: trimmedUsername,
      email: normalizedEmail,
      phone: trimmedPhone,
      password,
      dob: new Date(dob),
      gender,
    });

    await newUser.save();

    return res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Đăng ký thất bại. Lỗi server." });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email/số điện thoại/tên đăng nhập và mật khẩu.",
      });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
        { phone: normalizedIdentifier },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Tài khoản không tồn tại." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng." });
    }

    const payload = { userId: user._id, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Đăng nhập thất bại. Lỗi server." });
  }
};
