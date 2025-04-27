import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import scheduleUserRoutes from "./routes/scheduleUserRoutes.js";

dotenv.config({ path: "./backend/.env" });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/registrations", scheduleUserRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to database:", err);
  });
