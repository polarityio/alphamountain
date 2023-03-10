polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  activeTab: 'TODO',
  gettingQuotaMessage: '',
  gettingQuotaErrorMessage: '',
  getApiEndpointQuotaIsRunning: false,

  init() {
    //TODO use or remove
    this._super(...arguments);
  },

  getApiEndpointQuota: function () {
    const outerThis = this;

    this.set('gettingQuotaMessage', '');
    this.set('gettingQuotaErrorMessage', '');
    this.set('getApiEndpointQuotaIsRunning', true);

    this.sendIntegrationMessage({
      action: 'getApiEndpointQuota',
      data: {
        //TODO
      }
    })
      .then(({  }) => {
        // TODO
      })
      .catch((err) => {
        outerThis.set(
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
        outerThis.get('block').notifyPropertyChange('data');
        setTimeout(() => {
          outerThis.set('gettingQuotaMessage', '');
          outerThis.set('gettingQuotaErrorMessage', '');
          outerThis.get('block').notifyPropertyChange('data');
        }, 5000);
      });
  },
  actions: {
    changeTab: function (tabName) {
      this.set('activeTab', tabName);

      this.get('block').notifyPropertyChange('data');
    }
  }
});
