module.exports = {
  name: 'alphaMountain',
  acronym: 'AM',
  description:
    "TODO",
  entityTypes: [/** TODO */],
  styles: ['./styles/styles.less'],
  defaultColor: 'light-blue', // TODO check to make sure correct color
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
      name: 'Your API Token',
      description:
        'TODO',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
