const { getLogger } = require('../logging');
const { getImpersonate } = require('../queries');
const { parseErrorToReadableJson } = require('../dataTransformations');

const getApiEndpointImpersonate = async (
  {
    entities
  },
  options,
  callback
) => {
  const Logger = getLogger();
  try {
    const impersonate = await getImpersonate(entities, options);
    // throw new Error('Not work good. Request failed')
    callback(null, impersonate);
  } catch (error) {
    const err = parseErrorToReadableJson(error);
    Logger.error(
      {
        detail: 'Failed API Impersonations Lookup',
        options,
        formattedError: err
      },
      'API Impersonations Lookup Failed'
    ); 
    return callback({
      errors: [
        {
          err: error,
          detail: error.message || 'API Impersonations Lookup Failed'
        }
      ]
    });
  }
};

module.exports = getApiEndpointImpersonate;
