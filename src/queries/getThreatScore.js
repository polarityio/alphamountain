const { requestsInParallel } = require('../request');
const { map, filter, flow, get } = require('lodash/fp');

const getThreatScore = async (entities, options) => {
  const threatScoreRequests = flow(
    filter(get('isURL')),
    map((entity) => ({
      entity,
      method: 'POST',
      route: 'threat/uri',
      body: {
        uri: entity.value
      },
      options
    }))
  )(entities);

  const threatResponse = await requestsInParallel(threatScoreRequests, 'body.threat');

  return threatResponse;
};

module.exports = getThreatScore;
