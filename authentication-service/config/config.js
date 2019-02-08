import Joi from "joi";

// require and configure dotenv, will load vars in .env in PROCESS.ENV
import dotenv from "dotenv";

dotenv.config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(["development", "production", "test", "provision"])
    .default("development"),
  ADMIN_PW: Joi.string()
    .required()
    .description("Admin password required")
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(
    `Check your '.env' file (located at the root of this project),
    validation error: ${error.message}`
  );
}

const config = {
  env: envVars.NODE_ENV,
  ADMIN_PW: envVars.ADMIN_PW
};

export default config;
