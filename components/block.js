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
  categoryQuotaIsRunning: false,
  quotaInfo: {},
  isRunningKeyMap: {
    threat: 'threatsQuotaIsRunning',
    category: 'categoriesQuotaIsRunning'
  },
  redThreat: '#ed2e4d',
  greenThreat: '#7dd21b',
  yellowThreat: '#ffc15d',

  threatScoreWidth: Ember.computed('details.threatScore.score', function () {
    let reputation = this.get('details.threatScore.score');

    return this.get('details.threatScore.score') * 10;
  }),
  threatScoreIconColor: Ember.computed('details.threatScore.score', function () {
    let score = this.get('details.threatScore.score');
    if (score > 4) {
      return 'red';
    }
    if (score > 2) {
      return 'orange';
    }

    return 'lime';
  }),

  _getThreatColor(score) {
    if (score > 4) {
      return this.get('redThreat');
    } else if (score > 2) {
      return this.get('yellowThreat');
    } else {
      return this.get('greenThreat');
    }
  },

  actions: {
    getApiEndpointQuota: function (endpoint) {
      this.getApiEndpointQuota(endpoint);
    }
  },

  getApiEndpointQuota: function (endpoint) {
    console.log('getApiEndpointQuota', endpoint);

    const outerThis = this;

    this.set('gettingQuotaErrorMessage', '');
    this.set('getApiEndpointQuotaIsRunning', true);

    this.set(this.isRunningKeyMap[endpoint], true);

    // Pass the data to the integration
    this.sendIntegrationMessage({
      action: 'getApiEndpointQuota',
      data: {
        endpoint: endpoint
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
        this.set(this.isRunningKeyMap[endpoint], false);

        this.get('block').notifyPropertyChange('data');
        setTimeout(() => {
          this.set('gettingQuotaErrorMessage', '');
          this.get('block').notifyPropertyChange('data');
        }, 5000);
      });
  }
});
