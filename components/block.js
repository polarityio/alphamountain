polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('timezone', time);
    return time;
  }),

  activeTab: 'TODO',
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
  elementRadius: 20,
  elementStrokeWidth: 4,
  
  threatScoreWidth: Ember.computed('details.threatScore.score', function () {
    let reputation = this.get('details.threatScore.score');


    return this.get('details.threatScore.score') * 10;
  }),
  elementCircumference: Ember.computed('elementRadius', function () {
    return 2 * Math.PI * this.get('elementRadius');
  }),
  elementColor: Ember.computed('details.threatScore.score', function () {
    return this._getThreatColor(this.get('details.threatScore.score'));
  }),
  elementStrokeOffset: Ember.computed(
    'details.threatScore.score',
    'elementCircumference',
    function () {
      return this._getStrokeOffset(this.get('details.threatScore.score'), this.get('elementCircumference'));
    }
  ),
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

  _getStrokeOffset(score, circumference) {
    let progress = score / 10;
    return circumference * (1 - progress);
  },
  _getThreatColor(score) {
    if (score > 4) {
      return this.get('redThreat');
    }else if (score > 2) {
      return this.get('yellowThreat');
    } else {
      return this.get('greenThreat');
    }
  },
  init() {
    //TODO remove
    this._super(...arguments);
  },

  actions: {
    getApiEndpointQuota: function (endpoint) {
      this.getApiEndpointQuota(endpoint);
      //console.log('getQuota', endpoint);
    },

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
        console.log('quota', quota);
        this.set(
          'quotaInfo',
          Object.assign({}, this.get('quotaInfo'), { [endpoint]: quota })
        );
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
        this.set(this.isRunningKeyMap[endpoint], false);

        outerThis.get('block').notifyPropertyChange('data');
        setTimeout(() => {
          outerThis.set('gettingQuotaErrorMessage', '');
          outerThis.get('block').notifyPropertyChange('data');
        }, 5000);
      });
  },

  copyElementToClipboard(element) {
    window.getSelection().removeAllRanges();
    let range = document.createRange();

    range.selectNode(
      typeof element === 'string' ? document.getElementById(element) : element
    );
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  },
  getElementRance(element) {
    let range = document.createRange();
    range.selectNode(
      typeof element === 'string' ? document.getElementById(element) : element
    );
    return range;
  },
  restoreCopyState() {
    this.set('showCopyMessage', true);

    setTimeout(() => {
      if (!this.isDestroyed) {
        this.set('showCopyMessage', false);
      }
    }, 2000);
  }
});
