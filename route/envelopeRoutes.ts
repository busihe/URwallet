import express from "express";
import { getEnvelopes, transfer } from "../controller/envelopeController";
import { protect } from "../middleware/authMiddleware";
const router = express.Router();
router.get("/", protect, getEnvelopes);
router.post("/transfer", protect, transfer);
export default router;