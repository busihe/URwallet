import mongoose, { Document, Schema } from "mongoose";
export interface ITransaction extends Document {
userId: string;
accountId?: string;
amount: number;
direction: "credit" | "debit";
category: string;
provider: string;
meta?: object;
createdAt: Date;
}
const transactionSchema = new Schema<ITransaction>({
userId: { type: String, required: true },
accountId: { type: String },
amount: { type: Number, required: true },
direction: { type: String, enum: ["credit", "debit"], required: true },
category: { type: String, required: true },
provider: { type: String, required: true },
meta: { type: Object },
createdAt: { type: Date, default: Date.now }
});
export default mongoose.model<ITransaction>("Transaction", transactionSchema);