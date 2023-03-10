const {
  map,
  flow,
  uniqBy,
  get,
  split,
  join,
  toLower,
  drop,
  toUpper,
  snakeCase,
  replace,
  values,
  sum
} = require('lodash/fp');
const { mapObject } = require('../dataTransformations');
const { requestsInParallel } = require('../request');

const getAlerts = async (entities, options) => {
  const alertRequests = map(
    (entity) => ({
      entity,
      queryBuilder: createAlertsQueryBuilder(entity, options),
      options
    }),
    entities
  );

  const alerts = await requestsInParallel(alertRequests);

  const formattedAlerts = formatAlerts(alerts);

  return formattedAlerts;
};
/**
 * return [{ entity: {...}, result: [{...}] }];
 */

const createAlertsQueryBuilder = (entity, options) => (page) =>
  `{
    alerts(
      sortBy: { field: severity, direction: Descending }
      filter: {
        and: [
          { indicator: { operator: Eq, value: "${entity.value}" } },
          { severity: { operator: Gte, value: ${options.minSeverity} }},
          
        ]
      }
    ) {
      start
      end
      total
      items {
      }
    }
  }`;

const formatAlerts = (alerts) => {
  const formatAlertStatus = flow(get('status'), split('_'), drop(1), join(' '), toLower);

  const formatMitreField = flow(split('_'), drop(2), join(' '), toLower);

  const formatCorrelationKey = flow(snakeCase, replace(/_/g, ' '), toUpper);

  const formatAlert = (alert) => ({
    ...alert,
    formattedStatus: formatAlertStatus(alert),
    mitreTacticTechniquePair: map(
      (oneMitreTacticTechniquePair) => ({
        ...oneMitreTacticTechniquePair,
        formattedTactic: formatMitreField(oneMitreTacticTechniquePair.tactic),
        formattedTechnique: formatMitreField(oneMitreTacticTechniquePair.technique)
      }),
      alert.mitreTacticTechniquePair
    ),
    correlationCount: flow(get('correlations'), values, sum)(alert),
    correlations: mapObject(
      (correlationCount, correlationKey) => [
        formatCorrelationKey(correlationKey),
        correlationCount
      ],
      alert.correlations
    )
  });

  const formattedAlerts = map(
    ({ entity, result }) => ({
      entity,
      result: map(formatAlert, result)
    }),
    alerts
  );

  return formattedAlerts;
};

module.exports = getAlerts;
