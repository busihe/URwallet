import express from "express";
import { getDashboard } from "../controller/userController";
import { protect } from "../middleware/authMiddleware";
const router = express.Router();
router.get("/dashboard", protect, getDashboard);
export default router;