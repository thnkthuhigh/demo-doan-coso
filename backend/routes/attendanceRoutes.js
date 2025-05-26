import express from "express";
import {
  createSession,
  markAttendance,
  getClassAttendance,
  getUserAttendanceReport,
} from "../controllers/attendanceController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin/Instructor routes
router.post("/session", verifyToken, createSession);
router.post("/mark", verifyToken, markAttendance);
router.get("/class/:classId", verifyToken, getClassAttendance);

// User routes
router.get(
  "/user/:userId/class/:classId",
  verifyToken,
  getUserAttendanceReport
);

export default router;
