import express from "express";
import mongoose from "mongoose";
import {
  createSession,
  markAttendance,
  getSessionAttendance,
  getClassReport,
  getClassSessions,
  updateClassSession,
  getPaidStudentsCount,
} from "../controllers/attendanceController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tạo buổi học mới
router.post("/session", verifyToken, createSession);

// Cập nhật session hiện tại của lớp
router.put("/class/:classId/session", verifyToken, updateClassSession);

// Điểm danh học viên
router.post("/mark", verifyToken, markAttendance);

// Lấy danh sách điểm danh của một buổi học
router.get(
  "/session/:classId/:sessionNumber",
  verifyToken,
  getSessionAttendance
);

// Lấy báo cáo điểm danh của lớp
router.get("/class/:classId/report", verifyToken, getClassReport);

// Lấy danh sách sessions
router.get("/class/:classId/sessions", verifyToken, getClassSessions);

// Thêm route mới
router.get("/class/:classId/paid-students", verifyToken, getPaidStudentsCount);

// Route tạm thời để reset
router.delete("/force-reset", verifyToken, async (req, res) => {
  try {
    console.log("🗑️ Dropping attendances collection...");
    await mongoose.connection.db.collection("attendances").drop();
    console.log("✅ Collection dropped successfully");
    res.json({ message: "Đã reset toàn bộ attendance collection và indexes" });
  } catch (error) {
    console.error("Error resetting collection:", error);
    if (error.message.includes("ns not found")) {
      res.json({ message: "Collection không tồn tại hoặc đã được xóa" });
    } else {
      res
        .status(500)
        .json({ message: "Lỗi khi reset collection", error: error.message });
    }
  }
});

export default router;
