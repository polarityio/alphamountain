const { flow, get, size, find, eq, map, some, keys, getOr } = require('lodash/fp');
const { round } = require('./dataTransformations');
const { CATAGORYID_BY_CATAGORYNAME } = require('./constants');
const assembleLookupResults = (entities, categories, threatScore, options) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      categories,
      threatScore,
      options
    );

    const resultsFound = some(size, resultsForThisEntity);

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

const getResultsForThisEntity = (entity, categories, threatScore, options) => {
  const categoriesForThisEntity = getResultForThisEntityResult(entity, categories);

  const threatScoreForThisEntity = getResultForThisEntityResult(entity, threatScore);

  const categoriesWithNames = categoriesForThisEntity && {
    ...categoriesForThisEntity,
    categoryNames: map(
      (categoryId) => getOr(`ID - ${categoryId}`, categoryId, CATAGORYID_BY_CATAGORYNAME),
      get('categories', categoriesForThisEntity)
    )
  };

  const truncatedThreatScore = threatScoreForThisEntity && {
    ...threatScoreForThisEntity ,
    score: round(get('score', threatScoreForThisEntity), 5)
  };

  return {
    categories: categoriesWithNames,
    threatScore: truncatedThreatScore
  };
};

const createSummaryTags = ({ categories, threatScore }, options) => {
  const categoryNames = get('categoryNames', categories);
  const roundedScore = round(get('score', threatScore));
  const threatScoreValue = roundedScore ? `Score: ${roundedScore}` : undefined;

  return [].concat(categoryNames || []).concat(threatScoreValue || []);
};

const getResultForThisEntityResult = (entity, results) => {
  const resultsForThisEntity = find(
    (result) => get('entity.value', result) === entity.value,
    results
  );

  return get('result', resultsForThisEntity);
};

module.exports = assembleLookupResults;
