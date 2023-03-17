const { requestsInParallel } = require('../request');
const { map, filter } = require('lodash/fp');

const getThreatScore = async (entities, options) => {
  //TODO: check isUrl key on entities
  const urlEntities = filter((entity) => entity.isURL, entities);

  const threatScoreRequests = map(
    (entity) => ({
      entity,
      method: 'POST',
      route: 'threat/uri',
      body: {
        uri: entity.value
      },
      options
    }),
    urlEntities
  );

  const threatResponse = await requestsInParallel(threatScoreRequests, 'body.threat');

  return threatResponse;
};

module.exports = getThreatScore;
