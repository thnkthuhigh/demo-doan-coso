import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
  const { username, email, password, dob, gender } = req.body;

  // Validate input
  if (!username || !email || !password || !dob || !gender) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: username.trim() }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      dob: new Date(dob),
      gender,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error("Error during signup:", err);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const login = async (req, res) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return res
      .status(400)
      .json({ message: "Email/username and password are required." });
  }

  const identifier = email ? email.toLowerCase().trim() : username.trim();

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials: user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials: wrong password" });
    }

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
