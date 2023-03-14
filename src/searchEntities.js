const { getCategories } = require('./queries');

const searchEntities = async (entities, options) => {
  const categories = await getCategories(entities, options);
  
  return { categories };
};

module.exports = searchEntities;
