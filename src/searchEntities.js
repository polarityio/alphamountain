const { getCategories, getThreatScore, getImpersonate } = require('./queries');

const searchEntities = async (entities, options) => {
  const [categories, threatScore, impersonations] = await Promise.all([
    getCategories(entities, options),
    getThreatScore(entities, options),
    getImpersonate(entities, options)
  ]);

  return { categories, threatScore, impersonations };
};

module.exports = searchEntities;
