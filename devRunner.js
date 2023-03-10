const { doLookup } = require('./integration');
const { requestWithDefaults } = require('./src/request');
const fs = require('fs');
const { parseErrorToReadableJson } = require('./src/dataTransformations');

const main = async () => {
  clearOutputFile();

  const userOptions = {
    apiKey: '1pass'
  };

  const results = await Promise.all([
    // runDoLookup([{ value: 'id5-sync.com' }], userOptions),
    requestWithDefaults({
      method: 'POST',
      url: `https://www.google.com`,
      headers: {},
      options: userOptions
    }).catch(parseErrorToReadableJson)
  ]).catch(parseErrorToReadableJson);

  writeToOutputFile(results);
};

const clearOutputFile = () => fs.writeFileSync('devRunnerResults.json', '');
const writeToOutputFile = (content) =>
  fs.appendFileSync(
    'devRunnerResults.json',
    '\n' + JSON.stringify({ SOURCE: 'devRunner.js', content }, null, 2)
  );

const runDoLookup = async (entities, userOptions) =>
  new Promise((resolve, reject) => {
    doLookup(entities, userOptions, (err, lookupResults) =>
      resolve({ err, lookupResults })
    );
  });

main();
