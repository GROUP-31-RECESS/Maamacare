import express from "express";
import { getSyncStatus, pushSyncData, pullSyncData } from "../controllers/syncController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/status", protect, getSyncStatus);
router.post("/push", protect, pushSyncData);
router.get("/pull", protect, pullSyncData);
export default router;
