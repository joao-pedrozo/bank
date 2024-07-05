import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { globalIdField, connectionDefinitions } from "graphql-relay";

import { nodeInterface, registerTypeLoader } from "../loader/typeRegister";
import AccountLoader from "./AccountLoader";
import { AccountDocument } from "../models/AccountModel";

const AccountType = new GraphQLObjectType<AccountDocument>({
  name: "Account",
  description: "Ledger's account",
  fields: () => ({
    id: globalIdField("Account"),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Account's name",
    },
    balance: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Account's balance",
    },
    transactions: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "Transaction",
          fields: {
            id: globalIdField("Transaction"),
          },
        })
      ),
    },
  }),
  interfaces: () => [nodeInterface],
});

const AccountConnection = connectionDefinitions({
  name: "Account",
  nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };
