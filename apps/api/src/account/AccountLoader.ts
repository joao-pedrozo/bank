import { createLoader, NullConnection } from "@entria/graphql-mongo-helpers";

import { registerLoader } from "../loader/loaderRegister";

import { AccountModel } from "../models/AccountModel";

const Loader = createLoader({
  model: AccountModel,
  loaderName: "AccountLoader",
});

export default Loader;
export const { getLoader, clearCache, load, loadAll } = Loader;

registerLoader("AccountLoader", getLoader);
