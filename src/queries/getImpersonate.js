const { requestsInParallel } = require('../request');
const { map, filter, flow, get } = require('lodash/fp');

const getImpersonate = async (entities, options) => {
  const impersonateRequests = flow(
    filter(get('isURL')), 
    map((entity) => ({
      entity,
      method: 'POST',
      route: 'impersonate/uri',
      body: {
        uri: entity.value
      },
      options
    })
  ))(entities);

  const impersonateResponses = await requestsInParallel(impersonateRequests, 'body');

  return impersonateResponses;
};

module.exports = getImpersonate;
