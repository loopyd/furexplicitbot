const path = require('path');

// This module will setup the database by calling sync on all of the models automatically.
module.exports.run = async () => {
  const jsfiles = await FILES('../../database/models/', 'js', true, false);
  const modelsLength = jsfiles.length;
  // check if models are there.
  if (modelsLength <= 0) return LOG(`[${module.exports.data.name}] No model(s) to sync!`);
  // print output to log.
  await LOG(`[${module.exports.data.name}] Syncing ${modelsLength} table${modelsLength !== 1 ? 's' : ''}...`);
  // sync all models in the listing
  await jsfiles.forEach(async (FCN, i) => {
    const TABLE = require(`./${FCN}`);
    await LOG(`[${module.exports.data.name}]     ${i + 1}) Synced: ${TABLE.name}!`);
    await TABLE.sync();
  });
  await LOG(`[${module.exports.data.name}] Done syncing!`);
};

module.exports.data = {
  name: 'DBSync',
  callOn: '-',
};
