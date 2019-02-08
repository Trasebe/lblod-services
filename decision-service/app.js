import { app, errorHandler } from "mu";
import mongoose from "mongoose";
import util from "util";

import routes from "./app.routes";
import logger from "./config/Log";
import network from "./services/network.service";
import config from "./config/config";

const init = async () => {
  logger.info("=========== STARTING UP DECISION SERVER ===========");
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use(routes);
  app.use(errorHandler);

  try {
    await network.initFabric();
  } catch (e) {
    logger.info(`Please restart the resource server. ${e}`);
    process.exit(1);
  }

  const mongoUri =
    config.env === "production"
      ? "mongodb://mongodb:27017/abb-lblod"
      : "mongodb://mongodb:27017/abb-lblod-dev";

  // connect to mongo db
  await mongoose
    .connect(
      mongoUri,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        poolSize: 2
      }
    )
    .catch(
      e => new Error(`unable to connect to database: ${config.mongoUri}`, e)
    );

  // start server
  app.listen(80, () =>
    logger.info(`Started decision server on port 80 in ${app.get("env")} mode`)
  );

  // print mongoose logs in dev env
  if (app.get("env") === "development") {
    mongoose.set("debug", (collectionName, method, query, doc) => {
      logger.info(
        `${collectionName}.${method}`,
        util.inspect(query, false, 20),
        doc
      );
    });
  }
};

init();
