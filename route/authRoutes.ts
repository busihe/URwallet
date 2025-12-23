import express from "express";
import { register, login, verify2FA } from "../controller/authController";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/2fa/verify", verify2FA);
export default router;
