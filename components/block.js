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

  getApiEndpointQuota: function (endpoint) {
    const outerThis = this;

    this.set('gettingQuotaMessage', '');
    this.set('gettingQuotaErrorMessage', '');
    this.set('getApiEndpointQuotaIsRunning', true);

    // Pass the data to the integration
    this.sendIntegrationMessage({
      action: 'getApiEndpointQuota',
      data: {
        endpoint: endpoint
      }
    })
      .then((quota) => {
        outerThis.set('gettingQuotaMessage', `Quota: ${quota}`);
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
    },
    copyData: function () {
      Ember.run.scheduleOnce(
        'afterRender',
        this,
        this.copyElementToClipboard,
        `alphamountion-container-${this.get('uniqueIdPrefix')}`
      );

      Ember.run.scheduleOnce('destroy', this, this.restoreCopyState);
    }
  },
  copyElementToClipboard (element) {
    window.getSelection().removeAllRanges();
    let range = document.createRange();

    range.selectNode(typeof element === 'string' ? document.getElementById(element) : element);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  },
  getElementRance (element) {
    let range = document.createRange();
    range.selectNode(typeof element === 'string' ? document.getElementById(element) : element);
    return range;
  },
  restoreCopyState () {
    this.set('showCopyMessage', true);

    setTimeout(() => {
      if (!this.isDestroyed) {
        this.set('showCopyMessage', false);
      }
    }, 2000);
  }
});

