import { Request } from "koa";
import { DataLoaders, getAllDataLoaders } from "./loader/loaderRegister";

export type GraphQLContext = {
  req?: Request;
  // user?: User;
  dataloaders: DataLoaders;
};

type ContextVars = {
  // user?: any;
  req?: Request;
};

export const getContext = async (ctx: ContextVars) => {
  const dataloaders = getAllDataLoaders();

  return {
    req: ctx.req,
    dataloaders,
    //  user: ctx.user,
  } as GraphQLContext;
};
