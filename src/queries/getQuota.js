const { requestWithDefaults } = require('../request');

const getQuota = async (endpoint, options) => {

    const quotaRequest = {
        method: 'POST',
        route: 'quota',
        body: {
            endpoint
        },
        options
    };

    const quotaResponse = await requestWithDefaults(quotaRequest);

    return get('body', quotaResponse);
};


module.exports = getQuota;