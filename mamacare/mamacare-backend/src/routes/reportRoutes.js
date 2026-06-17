import express from "express";
import { clinicSummary } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/clinic-summary", protect, clinicSummary);
router.get("/printable-summary", protect, clinicSummary);
export default router;
