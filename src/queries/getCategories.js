const { requestsInParallel } = require('../request');
const { getLogger } = require('../logging');
const { map } = require('lodash/fp');

const getCategories = async (entities, options) => {
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
    entities
  );

  const categoryResponse = await requestsInParallel(categoryRequests, 'body.category');

  return categoryResponse
};

module.exports = getCategories;
