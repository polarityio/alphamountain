const { getLogger } = require('../logging');
const { requestsWithDefaults } = require('../request');
const { getQuota } = require('../onMessage');

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

    callback(null, quota);
  } catch (error) {
    const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
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
