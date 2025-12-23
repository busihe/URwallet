import { Response } from "express";
import { AuthReq } from "../middleware/authMiddleware";
import SavingsPot from "../model/SavingsPot";
import { z } from "zod";
import { NextFunction } from "express";
const lockSchema = z.object({
amount: z.number().positive(),
lockDays: z.number().int().min(1).max(365),
});
export const lockSavings = async (req: AuthReq, res: Response, next: NextFunction) => {
try {
const { amount, lockDays } = lockSchema.parse(req.body);
const pot = await SavingsPot.findOne({ userId: req.user!.id });
if (!pot) return res.status(404).json({ message: "Savings pot not found" });
pot.balance += amount;
pot.lockedUntil = new Date(Date.now() + lockDays * 24 * 60 * 60 * 1000);
await pot.save();
res.json({ message: "Locked", newBalance: pot.balance, lockedUntil: pot.lockedUntil });
} catch (e) {
next(e);
}
};
export const getProjections = async (req: AuthReq, res: Response) => {
const pot = await SavingsPot.findOne({ userId: req.user!.id });
if (!pot) return res.json({ projections: [] });
const rate = pot.annualRate;
const monthlyRate = rate / 12;
const projections = Array.from({ length: 12 }, (_, i) => {
const month = new Date();
month.setMonth(month.getMonth() + i + 1);
const future = pot.balance * Math.pow(1 + monthlyRate, i + 1);
return { month: month.toISOString().slice(0, 7), amount: future };
});
res.json({ projections });
};