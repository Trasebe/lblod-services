import requestPromise from "request-promise";
import sha256 from "crypto-js/sha256";
import { some } from "lodash";

import logger from "../config/Log";
import config from "../config/config";
import * as sparQLService from "./sparql.service";

import { STATUSES } from "../utils/constants";

let exptime;
if (config.env === "production") {
  exptime = [30000, 120000, 300000, 600000, 1800000];
} else {
  exptime = [10000, 10000, 10000, 10000, 10000];
}

const generalizeToResource = resource => {
  try {
    const identifier = resource.signatory.value.split("/")[
      resource.signatory.value.split("/").length - 1
    ];

    const roles = resource.roles.value.split(",");

    console.log(resource);

    return {
      id: resource.s.value,
      content: sha256(resource.content.value).toString(),
      oit: {
        identifier,
        roles,
        secret: resource.acmIdmSecret.value,
        fullIdentifier: resource.signatory.value
      },
      resourceId: resource.resourceUri.value,
      subject: resource.type.value,
      timestamp: resource.timestamp.value,
      version: 1 // resource.version.value TODO - retrieve version
    };
  } catch (e) {
    throw new Error(`generalizeToResource: ${e}`);
  }
};

const callDecisionService = async (resource, func, count = null) => {
  try {
    await requestPromise.post(`${config.decisionService}/decision/${func}`, {
      method: "POST",
      body: Object.assign({}, resource),
      json: true
    });
    await sparQLService.setResourceStatus(
      resource.id,
      STATUSES.PUBLISHED,
      resource.content
    );
    logger.info("Changed the status of resource to published");
  } catch (e) {
    const newCount = count === null ? 1 : count + 1;
    if (newCount < 6) {
      await sparQLService.setResourceStatusRetry(resource.id, e, newCount);
      setTimeout(
        callDecisionService,
        exptime[newCount - 1],
        resource,
        func,
        newCount
      );
      logger.info(`Changed the status of resource to waiting_for_retry: ${e}`);
      logger.info(
        `Timeout has been set for: ${exptime[newCount - 1] / 1000} seconds`
      );
    } else {
      await sparQLService.setResourceStatus(resource.id, STATUSES.FAILED);
      logger.info(
        `Object has been tried to publish ${newCount -
          1} times and failed. Changing status to failed`
      );
    }
  }
};

const setToPublishing = async resources => {
  try {
    for (const resource of resources) {
      await sparQLService.setResourceStatus(
        resource.s.value,
        STATUSES.PUBLISHING
      );
      logger.info("Changed the status of resource to publishing");
    }
  } catch (e) {
    logger.info(`Something went wrong setting the status to publishing: ${e}`);
    throw new Error(
      `Something went wrong setting the status to publishing: ${e}`
    );
  }
};

const notifyPublish = async (resources, count = null) => {
  resources.forEach(async resource => {
    try {
      const resourceObject = generalizeToResource(resource, "publish"); // TODO don't hardcode
      await callDecisionService(resourceObject, "publish", count); // TODO don't hardcode
    } catch (e) {
      await sparQLService.setResourceStatus(resource.s.value, STATUSES.FAILED);
      logger.info(
        `notifyPublish, Changed the status of resource to failed: ${e}`
      );
    }
  });
};

const notifySign = async resources => {
  for (const resource of resources) {
    try {
      const resourceObject = generalizeToResource(resource, "sign"); // TODO don't hardcode
      await callDecisionService(resourceObject, "sign"); // TODO don't hardcode
    } catch (e) {
      await sparQLService.setResourceStatus(resource.s.value, STATUSES.FAILED);
      logger.info(`notifySign, Changed the status of resource to failed: ${e}`);
    }
  }
};

const getInfoFromResource = resource => {
  const id = resource.s.value;
  const hash = sha256(resource.content.value).toString();
  return {
    id,
    hash
  };
};

const getDistinctResources = resources => {
  const distinctResources = [];

  resources.forEach(resource => {
    const found = some(
      distinctResources,
      distinctResource => resource.s.value === distinctResource.s.value
    );
    if (!found) {
      distinctResources.push(resource);
    }
  });
  return distinctResources;
};

export default {
  setToPublishing,
  notifyPublish,
  notifySign,
  getInfoFromResource,
  getDistinctResources
};
