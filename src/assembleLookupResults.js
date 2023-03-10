const { flow, get, size, find, eq, map, some, keys } = require('lodash/fp');

const assembleLookupResults = (entities, alerts, indicators, events, options) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      alerts,
      indicators,
      events,
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

const getResultsForThisEntity = (entity, alerts, indicators, events, options) => {
  const getResultForThisEntityResult = (results) =>
    flow(find(flow(get('entity.value'), eq(entity.value))), get('result'))(results);

  return {
    alerts: getResultForThisEntityResult(alerts),
    indicators: getResultForThisEntityResult(indicators),
    events: getResultForThisEntityResult(events)
  };
};

const createSummaryTags = ({ alerts, indicators, events }, options) =>
  []
  .concat(size(alerts) ? `Alerts: ${size(alerts)}` : [])
  .concat(size(indicators) ? `Indicators: ${size(indicators)}` : [])
  .concat(size(events) ? `Events: ${size(events)}` : []);

module.exports = assembleLookupResults;
