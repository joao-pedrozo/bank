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
            balance: { type: GraphQLFloat },
          },
        }),
        args: {
          name: { type: GraphQLString },
          balance: { type: GraphQLFloat },
        },
        resolve: async (_, args, context) => {
          const account = mongoose.model("Account");

          const DEFAULT_BALANCE = 0;

          const newAccount = new account({
            name: args.name,
            balance: args.balance || 0,
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
            throw new Error("From account ID is required");
          }

          if (!to) {
            throw new Error("To account ID is required");
          }

          const Account = mongoose.model("Account");
          const Transaction = mongoose.model("Transaction");

          const fromAccount = await Account.findById(from);
          const toAccount = await Account.findById(to);

          if (!fromAccount) {
            throw new Error("From account not found");
          }

          if (!toAccount) {
            throw new Error("To account not found");
          }

          if (fromAccount.balance < amount) {
            throw new Error("Insufficient funds");
          }

          const session = await mongoose.startSession();
          session.startTransaction();

          try {
            fromAccount.balance -= amount;
            toAccount.balance += amount;

            await fromAccount.save({ session });
            await toAccount.save({ session });

            const newTransaction = new Transaction({
              amount,
              from,
              to,
            });

            await newTransaction.save({ session });

            await session.commitTransaction();
            session.endSession();

            return newTransaction;
          } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new Error("Transaction failed: " + error.message);
          }
        },
      },
    }),
  }),
});
