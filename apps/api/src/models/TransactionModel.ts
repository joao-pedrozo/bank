import { Document, Schema, Types, model } from "mongoose";

export interface TransactionDocument extends Document {
  amount: number;
  from: Types.ObjectId;
  to: Types.ObjectId;
  description?: string;
  date: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    amount: { type: Number, required: true, min: 0 },
    from: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    to: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now, required: true },
  },
  {
    collection: "Transaction",
    timestamps: true,
  }
);

export const TransactionModel = model<TransactionDocument>(
  "Transaction",
  transactionSchema
);
