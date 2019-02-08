import Joi from "joi";

export const createScheme = {
  body: {
    enrollmentID: Joi.string().required(),
    role: Joi.string().required(),
    id: Joi.string().required(),
    seed: Joi.string().required()
  }
};

export const retrieveScheme = {
  body: {
    seed: Joi.string().required()
  }
};
