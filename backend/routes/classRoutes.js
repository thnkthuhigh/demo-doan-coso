import express from "express";
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  enrollClass,
  getClassMembers,
  getUserClasses,
} from "../controllers/classController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllClasses);

// Protected routes
router.post("/enroll", verifyToken, enrollClass);
router.get("/user/:userId", verifyToken, getUserClasses);
router.get("/:classId/members", verifyToken, getClassMembers);

// Admin routes
router.post("/", verifyToken, verifyAdmin, createClass);
router.put("/:id", verifyToken, verifyAdmin, updateClass);
router.delete("/:id", verifyToken, verifyAdmin, deleteClass);

export default router;
