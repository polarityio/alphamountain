const { getLogger } = require('../logging');
const { getQuota } = require('../queries');
const { parseErrorToReadableJson } = require('../dataTransformations');

const getApiEndpointQuota = async (
  {
    endpoint
  },
  options,
  callback
) => {
  const Logger = getLogger();
  try {
    const quota = await getQuota(endpoint, options);
    
    // throw new Error('Not work good. Request failed')
    callback(null, quota);
  } catch (error) {
    const err = parseErrorToReadableJson(error);
    Logger.error(
      {
        detail: 'Failed API Quota Lookup',
        options,
        formattedError: err
      },
      'API Quota Lookup Failed'
    ); 
    return callback({
      errors: [
        {
          err: error,
          detail: error.message || 'API Quota Lookup Failed'
        }
      ]
    });
  }
};

module.exports = getApiEndpointQuota;
