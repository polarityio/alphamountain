const { flow, get, size, find, eq, map, some, keys } = require('lodash/fp');

const assembleLookupResults = (entities, categories, threatScore, options) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      //TODO
      options
    );

    const resultsFound = flow(some(flow(keys, size)))(resultsForThisEntity);

    const lookupResult = {
      entity,
      data: resultsFound
        ? {
            summary: createSummaryTags(resultsForThisEntity, options),
            details: resultsForThisEntity
          }
        : null
    };

    return lookupResult;
  }, entities);

const getResultsForThisEntity = (entity, /**TODO */ options) => {
  const getResultForThisEntityResult = (results) =>
    flow(find(flow(get('entity.value'), eq(entity.value))), get('result'))(results);

  return {
  };
};

const createSummaryTags = ({ /**TODO */ }, options) =>
  []
  .concat();

module.exports = assembleLookupResults;
