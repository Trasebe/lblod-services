import requestPromise from "request-promise";
import httpStatus from "http-status";
import { isEmpty, chunk, uniqBy, difference, without, rest } from "lodash";
import config from "../../config/config";

import logger from "../../config/Log";
import * as sparQLService from "../../services/sparql.service";
import blockchainService from "../../services/blockchain.service";

import { STATUSES } from "../../utils/constants";

const TYPES = {
  PUBLISH: "publish",
  SIGN: "sign"
};

const handleNotify = async (resources, type, unique = false) => {
  const x = Math.ceil(resources.length / 5);
  const publishChunks = chunk(resources, x);

  const promises = publishChunks.map(async resourceChunk => {
    if (type === TYPES.PUBLISH) {
      return blockchainService.notifyPublish(resourceChunk);
    }

    return blockchainService.notifySign(resourceChunk);
  });

  if (unique) {
    await Promise.all(promises);
  }
};

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

    // Unique publishers - awaiting action to register
    const uniqPublishers = uniqBy(
      publishedResources,
      resource => resource.signatory.value
    );

    // All non-unique publishers, which can be handled async
    const uniqPublishersDiff = difference(publishedResources, uniqPublishers);

    // Unique signers - awaiting action to register
    const uniqSigners = uniqBy(
      signedResources,
      resource => resource.signatory.value
    );

    // All non-unique signers, which can be handled async
    const uniqSignersDiff = difference(signedResources, uniqSigners);

    const filteredUniqSigners = uniqSigners.filter(
      innerB =>
        !uniqPublishers
          .map(innerA => innerA.resourceUri.value)
          .includes(innerB.resourceUri.value)
    );

    const filteredUniqSignersDiff = uniqSignersDiff.filter(
      innerB =>
        !uniqPublishersDiff
          .map(innerA => innerA.resourceUri.value)
          .includes(innerB.resourceUri.value)
    );

    await blockchainService.setToPublishing(uniqPublishers);
    await blockchainService.setToPublishing(filteredUniqSigners);
    await blockchainService.setToPublishing(uniqPublishersDiff);
    await blockchainService.setToPublishing(filteredUniqSignersDiff);

    logger.info(
      `${uniqPublishers.length +
        uniqPublishersDiff.length} resources ready to be published`
    );

    logger.info(
      `${filteredUniqSigners.length +
        filteredUniqSignersDiff.length} resources ready to be signed`
    );

    if (!isEmpty(uniqPublishers)) {
      await handleNotify(uniqPublishers, TYPES.PUBLISH, true);
    }

    if (!isEmpty(filteredUniqSigners)) {
      await handleNotify(filteredUniqSigners, TYPES.SIGN, true);
    }

    if (!isEmpty(uniqPublishersDiff)) {
      handleNotify(uniqPublishersDiff, TYPES.PUBLISH);
    }

    if (!isEmpty(filteredUniqSignersDiff)) {
      handleNotify(filteredUniqSignersDiff, TYPES.SIGN);
    }

    res.sendStatus(httpStatus.OK);
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
          `${config.decisionService}/decision/validate`, // TODO remove decisionService from config
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
    res.sendStatus(httpStatus.OK);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const reset = async (req, res, next) => {
  try {
    await sparQLService.reset();
    res.sendStatus(httpStatus.OK);
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
      if (index % 2 === 0) {
        await sparQLService.insertRandomResource("SignedResource");
      } else {
        await sparQLService.insertRandomResource();
      }
    }

    res.sendStatus(httpStatus.OK);
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
