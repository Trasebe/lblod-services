import app from "../app";
import logger from "../config/Log";

const register = async (user, secret = null) => {
  const fabricCaClient = app.getFabricCaClient();
  const fabricClient = app.getFabricClient();

  if (!secret) {
    logger.info("Creating secret");
    // eslint-disable-next-line no-param-reassign
    secret = await fabricCaClient
      .register(
        {
          role: user.role,
          enrollmentID: user.username,
          affiliation: user.affiliation,
          attrs: [
            {
              name: "ID",
              value: user.id,
              ecert: true
            }
          ]
        },
        app.getAdminUser()
      )
      .catch(err => Promise.reject(new Error(`Failed to register: ${err}`)));
  }

  logger.info("Enrolling user on the fabric network");
  // Enroll the user
  const enrollment = await fabricCaClient
    .enroll({
      enrollmentID: user.username,
      enrollmentSecret: secret
    })
    .catch(err => Promise.reject(new Error(`Failed to enroll: ${err}`)));

  // Create the user
  const finalUser = await fabricClient.createUser({
    username: user.username,
    mspid: app.getOrgMsp(),
    cryptoContent: {
      privateKeyPEM: enrollment.key.toBytes(),
      signedCertPEM: enrollment.certificate
    },
    skipPersistence: false
  });

  logger.info("User was succesfully enrolled on the fabric network!");

  if (user.username === "admin") {
    return finalUser;
  }

  return Object.assign({}, finalUser, {
    signedCertPEM: enrollment.certificate,
    privateKeyPEM: enrollment.key.toBytes()
  });
};

export default { register };
