import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUserById,
  updateUserById,
  getAllUsers,
  deleteUser,
  createUserByAdmin, // Thêm import
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (cần login)
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);

// Admin routes
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.post("/admin/create", verifyToken, verifyAdmin, createUserByAdmin); // Route tạo user từ admin
router.get("/:id", verifyToken, verifyAdmin, getUserById);
router.put("/:id", verifyToken, verifyAdmin, updateUserById);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

export default router;
