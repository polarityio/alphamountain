const { requestsInParallel } = require('../request');
const { map, filter } = require('lodash/fp');

const getCategories = async (entities, options) => {
  const urlEntities = filter((entity) => entity.isURL, entities);

  const categoryRequests = map(
    (entity) => ({
      entity,
      method: 'POST',
      route: 'category/uri',
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
