const { requestWithDefaults } = require('../request');
const { map, filter, get } = require('lodash/fp');

const getThreatScore = async (entities, options) => {
  const urlEntities = filter((entity) => entity.isURL, entities);

  const threatScoreRequests = {
      method: 'POST',
      route: 'threat/uris',
      body: {
        uris: map((entity) => entity.value, urlEntities)
      },
      options
    };

  const threatResponse = get('body.scores', await requestWithDefaults(threatScoreRequests));

  return threatResponse;
};

module.exports = getThreatScore;
