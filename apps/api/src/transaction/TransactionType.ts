import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { globalIdField, connectionDefinitions } from "graphql-relay";

import { nodeInterface, registerTypeLoader } from "../loader/typeRegister";
import TransactionLoader from "./TransactionLoader";
import { TransactionDocument } from "../models/TransactionModel";
import { AccountType } from "../account/AccountType";

const TransactionType = new GraphQLObjectType<TransactionDocument>({
  name: "Transaction",
  description: "Ledger's account",
  fields: () => ({
    id: globalIdField("Transaction"),
    to: {
      type: new GraphQLNonNull(AccountType),
      resolve: async (account, _, context) => {
        return await context.dataloaders.AccountLoader.load(account.to);
      },
      description: "Transaction's destination account",
    },
    from: {
      type: new GraphQLNonNull(AccountType),
      resolve: async (account, _, context) => {
        return await context.dataloaders.AccountLoader.load(account.from);
      },
      description: "Transaction's source account",
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: "Transaction's amount",
    },
  }),
  interfaces: () => [nodeInterface],
});

const TransactionConnection = connectionDefinitions({
  name: "Transaction",
  nodeType: TransactionType,
});

registerTypeLoader(TransactionType, TransactionLoader.load);

export { TransactionType, TransactionConnection };
