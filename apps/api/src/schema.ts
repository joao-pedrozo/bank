import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      accounts: {
        type: new GraphQLList(
          new GraphQLObjectType({
            name: "Account",
            fields: {
              name: { type: GraphQLString },
              balance: { type: GraphQLFloat },
              currency: { type: GraphQLString },
            },
          })
        ),
        resolve: async () => {
          return [
            {
              name: "Checking",
              balance: 1000.0,
              currency: "USD",
            },
            {
              name: "Savings",
              balance: 5000.0,
              currency: "USD",
            },
          ];
        },
      },
    }),
  }),
});
