'use strict';
const { validateOptions } = require('./src/userOptions');
const { setLogger, getLogger } = require('./src/logging');

const {
  buildIgnoreResults,
  organizeEntities,
  parseErrorToReadableJson
} = require('./src/dataTransformations');

const searchEntities = require('./src/searchEntities');
const assembleLookupResults = require('./src/assembleLookupResults');
const onMessageFunctions = require('./src/onMessage');

const doLookup = async (entities, options, cb) => {
  const Logger = getLogger();
  try {
    Logger.debug({ entities }, 'Entities');


    const { categories, threatScore, impersonations } = await searchEntities(
      entities,
      options
    );

    Logger.trace({ categories, threatScore, impersonations }, 'Search Results');

    const lookupResults = assembleLookupResults(
      entities,
      categories,
      threatScore,
      impersonations,
      options
    );

    Logger.trace({ lookupResults }, 'Lookup Results');
    cb(null, lookupResults);
  } catch (error) {
    const err = parseErrorToReadableJson(error);

    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');
    cb({ detail: error.message || 'Lookup Failed', err });
  }
};

const onMessage = ({ action, data: actionParams }, options, callback) =>
  onMessageFunctions[action](actionParams, options, callback);

module.exports = {
  startup: setLogger,
  validateOptions,
  doLookup,
  onMessage
};
