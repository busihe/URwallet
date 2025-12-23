import { Response } from "express";
import { AuthReq } from "../middleware/authMiddleware";
import Envelope from "../model/Envelope";
import { z } from "zod";
import { NextFunction } from "express";
export const getEnvelopes = async (req: AuthReq, res: Response) => {
const envelopes = await Envelope.find({ userId: req.user!.id });
res.json(envelopes);
};
const transferSchema = z.object({
fromId: z.string(),
toId: z.string(),
amount: z.number().positive(),
});
export const transfer = async (req: AuthReq, res: Response, next: NextFunction) => {
try {
const { fromId, toId, amount } = transferSchema.parse(req.body);
const from = await Envelope.findOne({ _id: fromId, userId: req.user!.id });
const to = await Envelope.findOne({ _id: toId, userId: req.user!.id });
if (!from || !to) return res.status(404).json({ message: "Envelope not found" });
if (from.allocated - from.spent < amount)
return res.status(400).json({ message: "Insufficient funds" });

from.spent += amount;
to.allocated += amount;
await from.save();
await to.save();
res.json({ message: "Transferred" });
} catch (e) {
next(e);
}
};
