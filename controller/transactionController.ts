import { Response, NextFunction } from "express";
import { z } from "zod";
import { AuthReq } from "../middleware/authMiddleware";
import Transaction from "../model/Transaction";

const createSchema = z.object({
  amount: z.number().positive(),
  direction: z.enum(["credit", "debit"]),
  category: z.string().optional(),
  provider: z.string().optional(),
  meta: z.object({}).passthrough().optional(),
});

export const createTransaction = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createSchema.parse(req.body);

    const tx = await Transaction.create({
      ...data,
      userId: req.user!.id,
    });

    res.status(201).json(tx);
  } catch (e) {
    next(e);
  }
};

export const getTransactions = async (req: AuthReq, res: Response) => {
  const { from, to, category } = req.query;

  const filter: any = {
    userId: req.user!.id,
  };

  if (category) {
    filter.category = category;
  }

  if (from || to) {
    filter.createdAt = {};

    if (from) {
      filter.createdAt.$gte = new Date(from as string);
    }

    if (to) {
      filter.createdAt.$lte = new Date(to as string);
    }
  }

  const txs = await Transaction.find(filter).sort({ createdAt: -1 });
  res.json(txs);
};
