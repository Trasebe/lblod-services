import { app, errorHandler } from "mu";
import FabricClient from "fabric-client";
import path from "path";

import config from "./config/config";
import routes from "./app.routes";
import registerService from "./services/register.service";
import logger from "./config/Log";

const fabricClient = new FabricClient();
let fabricCaClient = null;
let adminUser = null;
let ORG_MSP = null;

const getClientForOrg = async (orgName, username) => {
  const configName = "-connection-profile-path";
  const client = FabricClient.loadFromConfig(
    FabricClient.getConfigSetting(`network${configName}`)
  );

  client.loadFromConfig(FabricClient.getConfigSetting(`client${configName}`));

  await client.initCredentialStores();

  if (username === "admin") {
    const user = fabricClient.getUserContext("admin", true);
    await client.setUserContext(user, true);
  }

  return client;
};

// ===============================   INITIALIZE FABRIC CA   ==================================
const initFabric = async () => {
  const file = "network-config-server.yaml";

  FabricClient.setConfigSetting(
    "network-connection-profile-path",
    path.join("/clients/", file)
  );

  FabricClient.setConfigSetting(
    `client-connection-profile-path`,
    path.join("/clients/", `client.yaml`)
  );

  // Define storepath
  const storePath = path.join(__dirname, ".hfc-key-store");

  // Set new crypto suite
  const cryptoSuite = FabricClient.newCryptoSuite();
  fabricClient.setCryptoSuite(cryptoSuite);

  // Set default key-value store to storePath
  const stateStore = await FabricClient.newDefaultKeyValueStore({
    path: storePath
  });
  fabricClient.setStateStore(stateStore);

  // Set crypto keystore to storePath
  const cryptoStore = FabricClient.newCryptoKeyStore({ path: storePath });
  cryptoSuite.setCryptoKeyStore(cryptoStore);

  const client = await getClientForOrg("client");
  client.setCryptoSuite(cryptoSuite);
  client.setStateStore(stateStore);
  fabricCaClient = client.getCertificateAuthority();
  ORG_MSP = client.getMspid();

  // Check if admin is enrolled
  const userFromStore = await fabricClient.getUserContext("admin", true);

  if (userFromStore && userFromStore.isEnrolled()) {
    adminUser = userFromStore;
  } else {
    adminUser = await registerService.register(
      {
        username: "admin",
        role: "admin",
        affiliation: `org1.department1`
      },
      config.ADMIN_PW
    );
  }

  client.setUserContext(adminUser, true);

  logger.info("Config has been set!");
};

const initializeExpress = async () => {
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

  await initFabric();

  // start server
  app.listen(80, () =>
    logger.info(`Started auth server on port 80 in ${app.get("env")} mode`)
  );
};

logger.info("=========== STARTING UP AUTH SERVER ===========");
initializeExpress();

const getFabricClient = () => fabricClient;
const getFabricCaClient = () => fabricCaClient;
const getAdminUser = () => adminUser;
const getOrgMsp = () => ORG_MSP;

export default {
  getFabricClient,
  getFabricCaClient,
  getAdminUser,
  getOrgMsp
};
