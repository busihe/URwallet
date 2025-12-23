import mongoose, { Document, Schema } from "mongoose";

export interface IEnvelope extends Document {
  userId: string;
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const envelopeSchema = new Schema<IEnvelope>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    allocated: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    spent: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Envelope = mongoose.model<IEnvelope>("Envelope", envelopeSchema);
export default Envelope;
