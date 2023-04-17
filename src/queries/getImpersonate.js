const { requestsInParallel } = require('../request');
const { map, flow } = require('lodash/fp');

const getImpersonate = async (entities, options) => {
  const impersonateRequests = flow(
    map((entity) => ({
      entity,
      method: 'POST',
      route: 'impersonate/uri',
      body: {
        uri: entity.value
      },
      options
    }))
  )(entities);

  const impersonateResponses = await requestsInParallel(impersonateRequests, 'body');

  return impersonateResponses;
};

module.exports = getImpersonate;
