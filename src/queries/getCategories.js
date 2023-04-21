const { requestsInParallel } = require('../request');
const { map } = require('lodash/fp');

const getCategories = async (entities, options) => {
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
    entities
  );

  const categoryResponses = await requestsInParallel(categoryRequests, 'body.category');

  return categoryResponses;
};

module.exports = getCategories;
