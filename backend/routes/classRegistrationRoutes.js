import express from "express";
import {
  registerClass,
  payForClass,
  getUserRegistrations,
  getAllRegistrations,
} from "../controllers/classRegistrationController.js";

const router = express.Router();

router.post("/", registerClass); // Đăng ký lớp học
router.put("/pay/:id", payForClass); // Thanh toán lớp học
router.get("/user/:userId", getUserRegistrations); // ✅ Route lấy danh sách đăng ký của 1 user
router.get("/", getAllRegistrations); // Admin lấy tất cả đăng ký

export default router;
