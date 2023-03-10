const {
  getAlerts,
  getIndicators,
  getEvents
} = require('./queries');

const searchEntities = async (entities, options) => {
  const [alerts, indicators] = await Promise.all([
    getAlerts(entities, options),
    getIndicators(entities, options)
  ]);

  const events = await getEvents(alerts, options);

  return {
    alerts,
    indicators,
    events
  };
};

module.exports = searchEntities;
