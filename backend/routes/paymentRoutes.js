import express from "express";
import {
  createPayment,
  getPaymentsByUser,
  getPendingPayments,
  approvePayment,
  rejectPayment,
} from "../controllers/paymentController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tạo thanh toán mới (user đã đăng nhập)
router.post("/", verifyToken, createPayment);

// Lấy danh sách thanh toán theo user
router.get("/user/:userId", verifyToken, getPaymentsByUser);

// Admin routes - lấy danh sách thanh toán chờ xác nhận
router.get("/pending", verifyToken, verifyAdmin, getPendingPayments);

// Admin xác nhận hoặc từ chối thanh toán
router.put("/approve/:paymentId", verifyToken, verifyAdmin, approvePayment);
router.put("/reject/:paymentId", verifyToken, verifyAdmin, rejectPayment);

export default router;
