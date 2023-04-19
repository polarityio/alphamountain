const { get } = require('lodash/fp');

const authenticateRequest = async (requestOptions) => ({
  ...requestOptions,
  url: `https://api.alphamountain.ai/${requestOptions.route}`,
  body: {
    ...requestOptions.body,
    version: 1,
    license: get('options.apiKey', requestOptions),
    type: 'partner.info'
  }
});

module.exports = authenticateRequest;
