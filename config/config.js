module.exports = {
  name: 'alphaMountain',
  acronym: 'AM',
  description:
    "asdfklads",
  entityTypes: ['url'],
  defaultColor: 'light-blue', // TODO check to make sure correct color
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
    proxy: '',
    rejectUnauthorized: true
  },
  logging: {
    level: 'trace' //trace, debug, info, warn, error, fatal
  },
  options: [
    //https://github.com/polarityio/int-ui-code-reference/blob/master/user-options/config.js
    {
      key: 'apiKey',
      name: 'License/API Key',
      description:
        'The License/API Key to use for accessing the alphaMountain API',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
