const { map, flatMap, eq, flow, get, filter } = require('lodash/fp');
const { requestsInParallel } = require('../request');

const getEvents = async (alerts, options) => {
  const eventRequests = flatMap(
    ({ entity, result: alerts }) =>
      map(
        (alert) => ({
          entity,
          queryBuilder: createEventsQueryBuilder(alert),
          options
        }),
        alerts
      ),
    alerts
  );

  const eventQueryResults = await requestsInParallel(eventRequests);

  const uniqEventsByEntityValue = getUniqEventsByEntityValue(alerts, eventQueryResults);

  return uniqEventsByEntityValue;
};
/**
 * return [{ entity: {...}, result: [{...}] }];
 */

const createEventsQueryBuilder = (alert) => (page) =>
  `{
  events(
    alertId: "${alert.id}"
    orderBy: "startTime"
    orderDirection: Descending
  ) {
    start
    end
    total
    items {
    }
  }
}`;

const getUniqEventsByEntityValue = (alerts, eventsQueryResults) => {
  const getAllEventsWithThisEntityValue = (entityValue) =>
    flow(
      filter(flow(get('entity.value'), eq(entityValue))),
      flatMap(get('result'))
    )(eventsQueryResults);

  const consolidatedEvents = map(
    ({ entity }) => ({
      entity,
      result: getAllEventsWithThisEntityValue(entity.value)
    }),
    alerts
  );

  return consolidatedEvents;
};

module.exports = getEvents;
