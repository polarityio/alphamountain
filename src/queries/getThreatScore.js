const { requestsInParallel } = require('../request');
const { map } = require('lodash/fp');

const getThreatScore = async (entities, options) => {
  const threatScoreRequests = map(
    (entity) => ({
      entity,
      method: 'POST',
      route: 'threat/uri',
      headers: { 'Content-Type': 'application/json' },
      body: {
        uri: entity.value
      },
      options
    }),
    entities
  );

  const threatResponse = await requestsInParallel(threatScoreRequests, 'body.threat');

  return threatResponse;
};

module.exports = getThreatScore;
