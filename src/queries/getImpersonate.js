const { requestsInParallel } = require('../request');
const { map,filter } = require('lodash/fp');

const getImpersonate = async (entities, options) => {
  // TODO: check isUrl key on entities
  const urlEntities = filter((entity) => entity.isURL, entities);

  const impersonateRequests = map(
    (entity) => ({
      entity,
      method: 'POST',
      route: 'impersonate/uri',
      body: {
        uri: entity.value
      },
      options
    }),
    urlEntities
  );

  const impersonateResponses = await requestsInParallel(impersonateRequests, 'body');

  console.log('impersonateResponses', impersonateResponses);
  
  return impersonateResponses;
};

module.exports = getImpersonate;
