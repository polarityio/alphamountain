const { validateStringOptions } = require('./utils');

const validateOptions = async (options, callback) => {
  const stringOptionsErrorMessages = {
    TODO: '* Required'
  };

  const stringValidationErrors = validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  const errors = stringValidationErrors.concat(minSeverityError);

  callback(null, errors);
};

module.exports = validateOptions;
