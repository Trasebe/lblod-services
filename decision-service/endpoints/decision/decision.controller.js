import httpStatus from "http-status";

import logger from "../../config/Log";
import decisionService from "../../services/decision.service";

const publish = async (req, res, next) => {
  try {
    logger.info("Publishing resources..");
    const resource = req.body;
    const result = await decisionService.Publish(resource);
    res.status(httpStatus.OK).json({ result });
  } catch (e) {
    next(e);
  }
};

const sign = async (req, res, next) => {
  try {
    logger.info("Signing resources..");
    const resource = req.body;
    const result = await decisionService.Sign(resource);
    res.status(httpStatus.OK).json({ result });
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await decisionService.GetAll();
    res.status(httpStatus.OK).json({ result });
  } catch (e) {
    next(e);
  }
};

const validate = async (req, res, next) => {
  try {
    const { id, hash } = req.body;
    const { result, blockchainHash } = await decisionService.Validate(id, hash);
    res.status(httpStatus.OK).json({
      id,
      hash,
      result,
      blockchainHash
    });
  } catch (e) {
    next(e);
  }
};

const queryById = async (req, res, next) => {
  try {
    const { id } = req.body;
    const result = await decisionService.GetResourceById(id);
    res.status(httpStatus.OK).json({ result });
  } catch (e) {
    next(e);
  }
};

const queryHistory = async (req, res, next) => {
  try {
    const { id } = req.body;
    const result = await decisionService.GetResourceHistory(id);
    res.status(httpStatus.OK).json({ result });
  } catch (e) {
    next(e);
  }
};

const queryHistoryByVersion = async (req, res, next) => {
  try {
    const { id, version } = req.body;
    const result = await decisionService.GetResourceHistoryByVersion(
      id,
      version
    );
    res.status(httpStatus.OK).json({ result });
  } catch (e) {
    next(e);
  }
};

export default {
  publish,
  getAll,
  sign,
  validate,
  queryById,
  queryHistory,
  queryHistoryByVersion
};
