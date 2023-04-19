polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return time;
  }),

  gettingQuotaMessage: '',
  gettingQuotaErrorMessage: '',
  getApiEndpointQuotaIsRunning: false,
  threatsQuotaIsRunning: false,
  categoriesQuotaIsRunning: false,
  quotaInfo: {},
  isRunningKeyMap: {
    threat: 'threatsQuotaIsRunning',
    category: 'categoriesQuotaIsRunning'
  },
  redThreat: '#ed2e4d',
  greenThreat: '#7dd21b',
  yellowThreat: '#ffc15d',

  threatScoreWidth: Ember.computed('details.threatScore.score', function () {
    return this.get('details.threatScore.score') * 10;
  }),
  threatScoreIconColor: Ember.computed('details.threatScore.score', function () {
    let score = this.get('details.threatScore.score');
    if (score > 4) {
      return 'high-risk';
    }
    if (score > 2) {
      return 'warning-risk';
    }

    return 'low-risk';
  }),

  actions: {
    getApiEndpointQuota: function (endpoint) {
      this.getApiEndpointQuota(endpoint);
    }
  },

  getApiEndpointQuota: function (endpoint) {
    this.set('gettingQuotaErrorMessage', '');
    this.set('getApiEndpointQuotaIsRunning', true);

    this.set(this.isRunningKeyMap[endpoint], true);

    // Pass the data to the integration
    this.sendIntegrationMessage({
      action: 'getApiEndpointQuota',
      data: {
        endpoint
      }
    })
      .then((quota) => {
        this.set(
          'quotaInfo',
          Object.assign({}, this.get('quotaInfo'), { [endpoint]: quota })
        );
      })
      .catch((err) => {
        this.set(
          'gettingQuotaErrorMessage',
          `Failed to Get Quota: ${
            (err &&
              (err.detail || err.message || err.err || err.title || err.description)) ||
            'Unknown Reason'
          }`
        );
      })
      .finally(() => {
        this.set('getApiEndpointQuotaIsRunning', false);
        this.set(this.isRunningKeyMap[endpoint], true);

        this.get('block').notifyPropertyChange('data');
        setTimeout(() => {
          if (!this.get('isDestroyed')) {
            this.set('gettingQuotaErrorMessage', '');
            this.get('block').notifyPropertyChange('data');
          }
        }, 5000);
      });
  }
});
