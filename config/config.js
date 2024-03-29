module.exports = {
  name: 'alphaMountain',
  acronym: 'AM',
  description:
    'alphaMountain is a cutting-edge data analysis platform that harnesses the power of advanced algorithms and machine learning techniques to provide comprehensive risk scores, content categories, and possible impersonations.',
  entityTypes: ['url'],
  defaultColor: 'light-blue',
  styles: ['./styles/styles.less'],
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },

  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ""
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    //https://github.com/polarityio/int-ui-code-reference/blob/master/user-options/config.js
    {
      key: 'apiKey',
      name: 'License/API Key',
      description: 'The License/API Key to use for accessing the alphaMountain API',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
