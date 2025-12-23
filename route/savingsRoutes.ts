import express from "express";
import { lockSavings, getProjections } from "../controller/savingsController";
import { protect } from "../middleware/authMiddleware";
const router = express.Router();
router.post("/lock", protect, lockSavings);
router.get("/projections", protect, getProjections);
export default router;