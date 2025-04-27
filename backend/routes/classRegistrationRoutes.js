import express from "express";
import { getRegistrationsByUserId } from "../controllers/classRegistrationController.js";

const router = express.Router();

router.get("/user/:userId", getRegistrationsByUserId);

export default router;
