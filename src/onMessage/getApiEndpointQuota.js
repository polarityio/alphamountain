const { getLogger } = require('../logging');
const { requestsWithDefaults } = require('../request');

const getApiEndpointQuota = async (
  {
    // TODO
  },
  options,
  callback
) => {
  const Logger = getLogger();
  try {
    // TODO

    callback(null, {});
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
