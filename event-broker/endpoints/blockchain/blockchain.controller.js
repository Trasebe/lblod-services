import requestPromise from "request-promise";
import httpStatus from "http-status";
import { isEmpty, chunk } from "lodash";
import config from "../../config/config";

import logger from "../../config/Log";
import * as sparQLService from "../../services/sparql.service";
import blockchainService from "../../services/blockchain.service";

import { STATUSES } from "../../utils/constants";

// has no dependencies - only internal logging needed
const notify = async (req, res, next) => {
  try {
    logger.info("Notified - querying resources...");

    const {
      results: { bindings: publishedResources }
    } = await sparQLService.getPublishResourcesByStatus(STATUSES.UNPUBLISHED);
    const {
      results: { bindings: signedResources }
    } = await sparQLService.getSignResourcesByStatus(STATUSES.UNPUBLISHED);

    logger.info(`${publishedResources.length} resources ready to be published`);
    logger.info(`${signedResources.length} resources ready to be signed`);

    const publishChunks = chunk(publishedResources, 20);
    const signChunks = chunk(signedResources, 20);

    if (!isEmpty(publishedResources)) {
      publishChunks.forEach(async resourceChunk => {
        await blockchainService.setToPublishing(resourceChunk);
        blockchainService.notifyPublish(resourceChunk);
      });
    }

    if (!isEmpty(signedResources)) {
      signChunks.forEach(async resourceChunk => {
        await blockchainService.setToPublishing(resourceChunk);
        blockchainService.notifySign(resourceChunk);
      });
    }

    res.status(httpStatus.OK);
  } catch (e) {
    logger.error(`Error during notify ${e}`);
    next(e);
  }
};

const validate = async (req, res, next) => {
  try {
    const {
      results: { bindings: publishedResources }
    } = await sparQLService.getPublishResourcesByStatus(STATUSES.PUBLISHED);

    const {
      results: { bindings: signedResources }
    } = await sparQLService.getSignResourcesByStatus(STATUSES.PUBLISHED);

    const resources = blockchainService.getDistinctResources(
      publishedResources.concat(signedResources)
    );

    if (!isEmpty(resources)) {
      const responses = [];

      // eslint-disable-next-line
      for (const resource of resources) {
        const { id, hash } = blockchainService.getInfoFromResource(resource);
        const response = await requestPromise.post(
          `${config.decisionService}/decision/validate`,
          {
            method: "POST",
            body: { id, hash },
            json: true
          }
        );
        responses.push(response);
      }
      res.status(httpStatus.OK).json({ responses });
    } else {
      logger.info("No resoucres found!");
      res.status(httpStatus.OK).json({ msg: "No resources found " });
    }
  } catch (e) {
    logger.error(`Error during validation ${e}`);
    next(e);
  }
};

const getByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const result = await sparQLService.getByStatus(status);
    res.status(httpStatus.OK).json({ result });
  } catch (e) {
    logger.error(`Error during query by status ${e}`);
    next(e);
  }
};

const getErrors = async (req, res, next) => {
  try {
    const result = await sparQLService.getErrors();
    res.status(httpStatus.OK).json({ result });
  } catch (e) {
    logger.error(`Error during query on errors ${e}`);
    next(e);
  }
};

const setup = async (req, res, next) => {
  try {
    logger.info("Adding resource");
    await sparQLService.insertResource(req.body);
    res.status(httpStatus.OK).send("Object was succesfully inserted");
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const reset = async (req, res, next) => {
  try {
    await sparQLService.reset();
    res.status(httpStatus.OK).send("SPARQL database was reset succcesfully");
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const setupByNumber = async (req, res, next) => {
  try {
    const { amount } = req.body;
    logger.info(`Adding ${amount} resources`);
    for (let index = 0; index < amount; index += 1) {
      await sparQLService.insertRandomResource();
    }

    res.status(httpStatus.OK).send("Object was succesfully inserted");
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export default {
  notify,
  getByStatus,
  validate,
  setup,
  reset,
  getErrors,
  setupByNumber
};
