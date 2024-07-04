import "./server";
import { connect } from "./database";

const bootstrap = async () => {
  await connect();
};

bootstrap();
