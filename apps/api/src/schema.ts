import {
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { connectionArgs } from "graphql-relay";

import AccountLoader from "./account/AccountLoader";
import { AccountConnection } from "./account/AccountType";
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
          },
        }),
        args: {
          name: { type: GraphQLString },
        },
        resolve: async (_, args, context) => {
          const account = mongoose.model("Account");

          const DEFAULT_BALANCE = 0;

          const newAccount = new account({
            name: args.name,
          });

          await newAccount.save();

          return newAccount;
        },
      },
    }),
  }),
});
