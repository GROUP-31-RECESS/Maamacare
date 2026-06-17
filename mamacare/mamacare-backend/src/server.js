import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import symptomRoutes from "./routes/symptomRoutes.js";
import vitalRoutes from "./routes/vitalRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import medicationRoutes from "./routes/medicationRoutes.js";
import babyMovementRoutes from "./routes/babyMovementRoutes.js";
import emergencyPlanRoutes from "./routes/emergencyPlanRoutes.js";
import healthRecordRoutes from "./routes/healthRecordRoutes.js";
import postnatalCareRoutes from "./routes/postnatalCareRoutes.js";
import supportPersonRoutes from "./routes/supportPersonRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import syncRoutes from "./routes/syncRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "MamaCare API",
    message: "Backend is running. Use /api/health to test the API.",
    apiHealth: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MamaCare API",
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/baby-movements", babyMovementRoutes);
app.use("/api/emergency-plan", emergencyPlanRoutes);
app.use("/api/health-record", healthRecordRoutes);
app.use("/api/postnatal-care", postnatalCareRoutes);
app.use("/api/support-people", supportPersonRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MamaCare backend running on http://localhost:${PORT}`);
});
