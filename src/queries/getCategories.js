const { requestsInParallel } = require('../request');
const { map,filter } = require('lodash/fp');

const getCategories = async (entities, options) => {
  // TODO: check isUrl key on entities
  const urlEntities = filter((entity) => entity.isUrl, entities);

  const categoryRequests = map(
    (entity) => ({
      entity,
      method: 'POST',
      route: 'category/uri',
      headers: { 'Content-Type': 'application/json' },
      body: {
        uri: entity.value
      },
      options
    }),
    urlEntities
  );

  const categoryResponses = await requestsInParallel(categoryRequests, 'body.category');

  return categoryResponses;
};

module.exports = getCategories;
