const { flow, get, size, find, map, some, getOr } = require('lodash/fp');
const { round } = require('./dataTransformations');
const { CATAGORYID_BY_CATAGORYNAME } = require('./constants');
const assembleLookupResults = (
  entities,
  categories,
  threatScore,
  impersonations,
  options
) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      categories,
      threatScore,
      impersonations,
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

const getResultsForThisEntity = (
  entity,
  categories,
  threatScore,
  impersonations,
  options
) => {
  const categoriesForThisEntity = getResultForThisEntityResult(entity, categories);

  const threatScoreForThisEntity = getResultForThisEntityResult(entity, threatScore);

  const impersonationsForThisEntity = getResultForThisEntityResult(
    entity,
    impersonations
  );

  const categoriesWithNames =
    categoriesForThisEntity &&
    flow(
      get('categories'),
      map((categoryId) =>
        getOr(`ID - ${categoryId}`, categoryId, CATAGORYID_BY_CATAGORYNAME)
      ),
      (categoryNames) => ({ ...categoriesForThisEntity, categoryNames })
    )(categoriesForThisEntity);

  const truncatedThreatScore = threatScoreForThisEntity && {
    ...threatScoreForThisEntity,
    score: round(get('score', threatScoreForThisEntity), 5)
  };

  const impersonationForThisEntity = impersonationsForThisEntity && {
    ...impersonationsForThisEntity,
    impersonations: get('impersonations', impersonationsForThisEntity)
  };

  return {
    categories: categoriesWithNames,
    threatScore: truncatedThreatScore,
    impersonations: impersonationForThisEntity
  };
};

const createSummaryTags = ({ categories, threatScore, impersonations }, options) => {
  const categoryNames = get('categoryNames', categories);
  const roundedScore = flow(get('score'), round)(threatScore);
  const threatScoreValue = roundedScore ? `Score: ${roundedScore}` : [];
  const impersonationTags =
    impersonations.impersonate && impersonations.impersonate.length
      ? 'Impersonations Found'
      : [];

  return []
    .concat(categoryNames || [])
    .concat(threatScoreValue)
    .concat(impersonationTags);
};

const getResultForThisEntityResult = (entity, results) => {
  const resultsForThisEntity = find(
    (result) => get('entity.value', result) === entity.value,
    results
  );

  return get('result', resultsForThisEntity);
};

module.exports = assembleLookupResults;
