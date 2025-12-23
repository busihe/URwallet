import mongoose, { Document, Schema } from "mongoose";

export interface ISavingsPot extends Document {
  userId: string;
  balance: number;
  annualRate: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const savingsPotSchema = new Schema<ISavingsPot>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    annualRate: {
      type: Number,
      required: true,
    },
    lockedUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const SavingsPot = mongoose.model<ISavingsPot>(
  "SavingsPot",
  savingsPotSchema
);

export default SavingsPot;
