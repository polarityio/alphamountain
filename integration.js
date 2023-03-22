'use strict';
const { validateOptions, parseUserOptions } = require('./src/userOptions');
const { setLogger, getLogger } = require('./src/logging');

const {
  buildIgnoreResults,
  organizeEntities,
  parseErrorToReadableJson
} = require('./src/dataTransformations');

const searchEntities = require('./src/searchEntities');
const assembleLookupResults = require('./src/assembleLookupResults');
const onMessageFunctions = require('./src/onMessage');

const doLookup = async (entities, userOptions, cb) => {
  const Logger = getLogger();
  try {
    Logger.debug({ entities }, 'Entities');

    const { searchableEntities, nonSearchableEntities } = organizeEntities(entities);

    const options = parseUserOptions(userOptions);

    const { categories, threatScore} = await searchEntities(
      searchableEntities,
      options
    );

    Logger.trace({ categories, threatScore });
    
    const lookupResults = assembleLookupResults(
      entities,
      categories,
      threatScore,
      options
    );

    const ignoreResults = buildIgnoreResults(nonSearchableEntities);

    Logger.trace({ lookupResults, ignoreResults }, 'Lookup Results');
    cb(null, lookupResults.concat(ignoreResults));
  } catch (error) {
    const err = parseErrorToReadableJson(error);

    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');
    cb({ detail: error.message || 'Lookup Failed', err });
  }
};

const onMessage = ({ action, data: actionParams }, options, callback) =>
  onMessageFunctions[action](actionParams, options, callback);

// const onMessage = (payload, options, callback) => {
//   Logger.trace({ payload, options }, 'aaaaaaa');
// };

module.exports = {
  startup: setLogger,
  validateOptions,
  doLookup,
  onMessage
};
