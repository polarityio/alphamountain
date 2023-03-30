const { requestWithDefaults } = require('../request');
const { map, filter, get, flow } = require('lodash/fp');

const getThreatScore = async (entities, options) => {
  const urlEntityValues = flow(filter(get('isURL')), map(get('value')))(entities);

  const threatScoreRequests = {
    method: 'POST',
    route: 'threat/uris',
    body: {
      uris: urlEntityValues
    },
    options
  };

  const threatResponse = get(
    'body.scores',
    await requestWithDefaults(threatScoreRequests)
  );

  return threatResponse;
};

module.exports = getThreatScore;
