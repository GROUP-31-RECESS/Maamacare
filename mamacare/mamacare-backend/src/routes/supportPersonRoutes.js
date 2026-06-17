import express from "express";
import { getAll, createOne, updateOne, deleteOne } from "../controllers/supportPersonController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", protect, getAll);
router.post("/", protect, createOne);
router.put("/:id", protect, updateOne);
router.delete("/:id", protect, deleteOne);
export default router;
