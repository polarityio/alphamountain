const { getCategories, getThreatScore, getQuota } = require('./queries');

const searchEntities = async (entities, options) => {
  const categories = await getCategories(entities, options);
  const threatScore = await getThreatScore(entities, options);
  return { categories, threatScore};
};

module.exports = searchEntities;
