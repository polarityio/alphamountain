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
  const categoriesWithNames =
    categoriesForThisEntity &&
    flow(
      get('categories'),
      map((categoryId) =>
        getOr(`ID - ${categoryId}`, categoryId, CATAGORYID_BY_CATAGORYNAME)
      ),
      (categoryNames) => ({ ...categoriesForThisEntity, categoryNames })
    )(categoriesForThisEntity);

  return {
    categories: categoriesWithNames
  };
};

const createSummaryTags = ({}, options) => {
  return;
};

const getResultForThisEntityResult = (entity, results) => {
  return;
};

module.exports = assembleLookupResults;
