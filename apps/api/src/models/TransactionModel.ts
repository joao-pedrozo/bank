import { Document, Schema, Types, model } from "mongoose";

export interface TransactionDocument extends Document {
  accountId: Types.ObjectId;
  type: "credit" | "debit";
  amount: number;
  description?: string;
  date: Date;
  balance: number;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    balance: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
  },
  {
    collection: "Transaction",
    timestamps: { createdAt: "date", updatedAt: false },
  }
);

export const TransactionModel = model<TransactionDocument>(
  "Transaction",
  transactionSchema
);
