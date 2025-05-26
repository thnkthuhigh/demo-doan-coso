import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Xác thực token
export const verifyToken = async (req, res, next) => {
  try {
    // Log headers for debugging
    console.log("Auth headers:", req.headers);

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Extract token - handle both "Bearer token" and just "token" formats
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    // Log token (in development only)
    console.log("Token received:", token.substring(0, 15) + "...");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-fallback-secret-key"
    );
    console.log("Token decoded successfully:", decoded);

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn" });
    }

    return res
      .status(500)
      .json({ message: "Lỗi xác thực", error: error.message });
  }
};

// Xác thực quyền admin
export const verifyAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Không có quyền admin" });
  }
  next();
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Vui lòng đăng nhập để tiếp tục" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-fallback-secret-key"
    );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền thực hiện thao tác này" });
  }
};
