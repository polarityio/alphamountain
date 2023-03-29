const { getCategories, getThreatScore, getImpersonate } = require('./queries');

const searchEntities = async (entities, options) => {
  const categories = await getCategories(entities, options);
  const threatScore = await getThreatScore(entities, options);
  const impersonations = await getImpersonate(entities, options);
  return { categories, threatScore, impersonations};
};

module.exports = searchEntities;
