import express from "express";
import { getOne, updateOne } from "../controllers/healthRecordController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", protect, getOne);
router.put("/", protect, updateOne);
export default router;
