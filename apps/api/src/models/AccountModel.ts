import { Document, Schema, Types, model } from "mongoose";

export interface AccountDocument extends Document {
  name: string;
  balance: number;
  transactions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  cpf: string;
}

const validateCPF = (cpf) => {
  return /^\d{11}$/.test(cpf); // simple: must have 11 digits
};

const accountSchema = new Schema<AccountDocument>(
  {
    name: { type: String, required: true, trim: true },
    balance: { type: Number, default: 0, required: true, min: 0 },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    cpf: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validateCPF,
        message: (props) => `${props.value} is not a valid CPF!`,
      },
    },
  },
  {
    collection: "Account",
    timestamps: true,
  }
);

export const AccountModel = model<AccountDocument>("Account", accountSchema);
