import express from "express";
import { askMamaCareAI } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ask", protect, askMamaCareAI);

export default router;
