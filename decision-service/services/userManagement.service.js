import requestPromise from "request-promise";
import CryptoJS from "crypto-js";

import User from "../models/auth.model";

const RegisterUser = async oit => {
  const {
    encryptedCert,
    encryptedKey,
    encryptionKey
  } = await requestPromise.post("http://authentication/certificate/create", {
    method: "POST",
    body: {
      enrollmentID: oit.identifier,
      role: oit.roles.toString(),
      id: oit.fullIdentifier,
      seed: oit.secret
    },
    json: true
  });

  let bytes = CryptoJS.AES.decrypt(
    encryptedCert,
    JSON.stringify(encryptionKey)
  );
  const certificatePEM = bytes.toString(CryptoJS.enc.Utf8);

  // Decrypt private key
  bytes = CryptoJS.AES.decrypt(encryptedKey, JSON.stringify(encryptionKey));
  const privateKeyPEM = bytes.toString(CryptoJS.enc.Utf8);

  const newUser = new User({
    username: oit.identifier,
    encryptedCert,
    encryptedKey
  });

  await newUser.save();

  return { username: oit.identifier, certificatePEM, privateKeyPEM };
};

const GetUser = async identifier => User.getByName(identifier);

const GetEncryptionKey = async oit => {
  const responseRetrieve = await requestPromise.post(
    "http://authentication/certificate/retrieveKey",
    {
      method: "POST",
      body: { identifier: oit, seed: oit.secret },
      json: true
    }
  );

  return JSON.parse(responseRetrieve.encryptionKey);
};

export default { RegisterUser, GetUser, GetEncryptionKey };
