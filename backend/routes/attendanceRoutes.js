import express from "express";
import {
  createSessionAttendance,
  markAttendance,
  getSessionAttendance,
  getUserAttendanceReport,
  getClassAttendanceReport,
  updateClassSession,
} from "../controllers/attendanceController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/session", verifyToken, verifyAdmin, createSessionAttendance);
router.post("/mark", verifyToken, verifyAdmin, markAttendance);
router.get(
  "/session/:classId/:sessionNumber",
  verifyToken,
  verifyAdmin,
  getSessionAttendance
);
router.get(
  "/class/:classId/report",
  verifyToken,
  verifyAdmin,
  getClassAttendanceReport
);
router.put(
  "/class/:classId/session",
  verifyToken,
  verifyAdmin,
  updateClassSession
);

// User routes
router.get("/user/:userId/report", verifyToken, getUserAttendanceReport);

export default router;
