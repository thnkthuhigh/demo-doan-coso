import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

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
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // Direct password comparison using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "your-fallback-secret-key",
      { expiresIn: "7d" }
    );

    // Return user info and token
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        membership: user.membership,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Đăng nhập thất bại", error: error.message });
  }
};
