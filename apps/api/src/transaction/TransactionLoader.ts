import { createLoader } from "@entria/graphql-mongo-helpers";

import { registerLoader } from "../loader/loaderRegister";

import { TransactionModel } from "../models/TransactionModel";

const Loader = createLoader({
  model: TransactionModel,
  loaderName: "TransactionLoader",
});

export default Loader;
export const { getLoader, clearCache, load, loadAll } = Loader;

registerLoader("TransactionLoader", getLoader);
