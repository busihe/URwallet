import { Response } from "express";
import { AuthReq } from "../middleware/authMiddleware";
import User from "../model/User";
import Transaction from "../model/Transaction";
export const getDashboard = async (req: AuthReq, res: Response) => {
const user = await User.findById(req.user!.id);
const transactions = await Transaction.find({ userId: req.user!.id }).sort({ createdAt: -1 }).limit(30);
const dailyBurn = transactions
.filter((t) => t.direction === "debit")
.reduce((sum, t) => sum + t.amount, 0) / 30;
const currentBalance = 600000; // placeholder – later aggregate envelopes
const daysLeft = dailyBurn ? Math.floor(currentBalance / dailyBurn) : 999;
res.json({
daysLeft,
safeToSpend: Math.max(0, currentBalance - dailyBurn * 7),
chartDatasets: {
burnHistory: transactions.map((t) => ({ date: t.createdAt, amount: t.amount })),
},
});
};