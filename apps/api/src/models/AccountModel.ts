import { Document, Schema, Types, model } from "mongoose";

export interface AccountDocument extends Document {
  name: string;
  transactions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<AccountDocument>(
  {
    name: { type: String, required: true, trim: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  },
  {
    collection: "Account",
    timestamps: true,
  }
);

export const AccountModel = model<AccountDocument>("Account", accountSchema);
