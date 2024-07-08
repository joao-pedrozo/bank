import {
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { connectionArgs } from "graphql-relay";

import AccountLoader from "./account/AccountLoader";
import TransactionLoader from "./transaction/TransactionLoader";

import { AccountConnection } from "./account/AccountType";
import { TransactionConnection } from "./transaction/TransactionType";
import mongoose from "mongoose";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      accounts: {
        type: new GraphQLNonNull(AccountConnection.connectionType),
        args: connectionArgs,
        description: "List of accounts",
        resolve: async (_, args, context) =>
          await AccountLoader.loadAll(context, args),
      },
      transactions: {
        type: new GraphQLNonNull(TransactionConnection.connectionType),
        args: connectionArgs,
        description: "List of transactions",
        resolve: async (_, args, context) =>
          await TransactionLoader.loadAll(context, args),
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
      createAccount: {
        type: new GraphQLObjectType({
          name: "AccountMutation",
          fields: {
            name: { type: GraphQLString },
            cpf: { type: GraphQLString },
          },
        }),
        args: {
          name: { type: GraphQLString },
          cpf: { type: GraphQLString },
        },
        resolve: async (_, args, context) => {
          const account = mongoose.model("Account");

          const newAccount = new account({
            name: args.name,
            cpf: args.cpf,
          });

          await newAccount.save();

          return newAccount;
        },
      },
      createTransaction: {
        type: new GraphQLObjectType({
          name: "TransactionMutation",
          fields: {
            amount: { type: GraphQLFloat },
            accountId: { type: GraphQLString },
          },
        }),
        args: {
          amount: { type: GraphQLFloat },
          from: { type: GraphQLString },
          to: { type: GraphQLString },
        },
        resolve: async (_, args, context) => {
          const { amount, from, to } = args;

          if (!amount || amount <= 0) {
            throw new Error("Amount must be greater than zero");
          }

          if (!from) {
            throw new Error("From account CPF is required");
          }

          if (!to) {
            throw new Error("To account CPF is required");
          }

          const Account = mongoose.model("Account");
          const Transaction = mongoose.model("Transaction");

          const fromAccount = await Account.findOne({ cpf: from });
          const toAccount = await Account.findOne({ cpf: to });

          if (!fromAccount) {
            throw new Error("From account not found");
          }

          if (!toAccount) {
            throw new Error("To account not found");
          }

          const fromAccountCredit = await Transaction.aggregate([
            {
              $match: {
                to: fromAccount._id,
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ]);

          const fromAccountDebit = await Transaction.aggregate([
            {
              $match: {
                from: fromAccount._id,
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ]);

          const fromAccountBalance = fromAccountCredit.length
            ? fromAccountCredit[0].total
            : 0 - fromAccountDebit[0]?.total;

          console.log(fromAccountBalance);

          if (fromAccountBalance < amount) {
            throw new Error("Insufficient funds");
          }

          const session = await mongoose.startSession();
          session.startTransaction();

          try {
            const creditTransaction = new Transaction({
              amount,
              from: fromAccount._id,
              to: toAccount._id,
            });

            const debitTransaction = new Transaction({
              amount: -amount,
              from: toAccount._id,
              to: fromAccount._id,
            });

            await creditTransaction.save({ session });
            await debitTransaction.save({ session });

            await session.commitTransaction();
            session.endSession();

            return creditTransaction;
          } catch (error) {
            await session.abortTransaction();
            session.endSession();

            throw error;
          }
        },
      },
    }),
  }),
});
