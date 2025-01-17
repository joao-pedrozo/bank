export interface DataLoaders {
  AccountLoader?: ReturnType<
    typeof import("../account/AccountLoader").getLoader
  >;
}

const loaders: {
  [Name in keyof DataLoaders]: () => DataLoaders[Name];
} = {};

const registerLoader = <Name extends keyof DataLoaders>(
  key: Name,
  getLoader: (typeof loaders)[Name]
) => {
  loaders[key] = getLoader;
};

const getAllDataLoaders = (): DataLoaders =>
  Object.entries(loaders).reduce(
    (obj, [loaderKey, loaderFn]) => ({
      ...obj,
      [loaderKey]: loaderFn(),
    }),
    {}
  );

export { registerLoader, getAllDataLoaders };
