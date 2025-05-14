import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Xác thực token
export const verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không tìm thấy token xác thực" });
    }

    const token = authHeader.split(" ")[1];

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Đính kèm thông tin người dùng vào request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Xác thực quyền admin
export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    // Kiểm tra role từ token
    if (req.user.role !== "admin") {
      // Double-check từ database nếu cần
      const user = await User.findById(req.user.userId);
      if (!user || user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền thực hiện hành động này" });
      }
    }

    next();
  } catch (error) {
    console.error("Lỗi xác thực quyền admin:", error);
    return res.status(500).json({ message: "Lỗi xác thực quyền admin" });
  }
};
