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
  const {
    results: { bindings: publishedResources }
  } = await sparQLService.getPublishResourcesByStatus(STATUSES.PUBLISHING);
  const {
    results: { bindings: signedResources }
  } = await sparQLService.getSignResourcesByStatus(STATUSES.PUBLISHING);

  const filteredResources = resources.reduce((r, e) => {
    if (!publishedResources.includes(e)) return Object.assign({}, r, e);
    if (!signedResources.includes(e)) return Object.assign({}, r, e);
    return r;
  }, {});

  // console.log(filteredResources);
  // console.log("=====");
  // console.log(resources);

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

    // Filter currently pending resources to avoid the creation of 2 objects for a new resource
    // const filteredUniqPublishers = uniqPublishers.filter(
    //   o => !uniqSigners.find(o2 => o.resourceUri.value === o2.resourceUri.value)
    // );

    // const filteredUniqPublishersDiff = uniqPublishersDiff.filter(
    //   o =>
    //     !uniqSignersDiff.find(
    //       o2 => o.resourceUri.value === o2.resourceUri.value
    //     )
    // );

    // Filtering same public/signing object - need to be removed from the signing objects
    const filteredUniqPublishers = without(
      uniqPublishers.map(p => p.resourceUri.value), // Looping over all unique publishing objects
      rest(() => uniqSigners.map(p => p.resourceUri.value)) // Filtering all occurencies of uniqSigning objects
    );

    const x = uniqPublishers.filter(
      o => !filteredUniqPublishers.find(o2 => o.resourceUri.value === o2)
    );

    const filteredUniqPublishersDiff = without(
      uniqPublishersDiff.map(p => p.resourceUri.value),
      rest(() => uniqSignersDiff.map(p => p.resourceUri.value))
    );

    const y = uniqPublishersDiff.filter(
      o => !filteredUniqPublishersDiff.find(o2 => o.resourceUri.value === o2)
    );

    console.log("filteredUniqPublishers.length", uniqSigners.length);
    console.log("x.lenght", x.length);
    console.log("x.lenght", uniqSignersDiff.length);
    console.log("y.lenght", y.length);

    // TODO filter filtered from sign object

    await blockchainService.setToPublishing(filteredUniqPublishers);
    await blockchainService.setToPublishing(uniqSigners);
    await blockchainService.setToPublishing(filteredUniqPublishersDiff);
    await blockchainService.setToPublishing(uniqSignersDiff);

    logger.info(
      `${filteredUniqPublishers.length +
        filteredUniqPublishersDiff.length} resources ready to be published`
    );
    logger.info(
      `${uniqSigners.length +
        uniqSignersDiff.length} resources ready to be signed`
    );

    if (!isEmpty(filteredUniqPublishers)) {
      await handleNotify(filteredUniqPublishers, TYPES.PUBLISH, true);
    }

    if (!isEmpty(uniqSigners)) {
      await handleNotify(uniqSigners, TYPES.SIGN, true);
    }

    if (!isEmpty(filteredUniqPublishersDiff)) {
      handleNotify(filteredUniqPublishersDiff, TYPES.PUBLISH);
    }

    if (!isEmpty(uniqSignersDiff)) {
      handleNotify(uniqSignersDiff, TYPES.SIGN);
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
