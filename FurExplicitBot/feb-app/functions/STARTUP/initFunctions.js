module.exports.run = async () => {
  // get all function files
  const jsfiles = await FILES('./functions', 'js', true, true);
  const funcLength = jsfiles.length;
  // check if functions are there
  if (jsfiles.length <= 0) return LOG(`[${module.exports.data.name}] No function(s) to load!`);

  LOG(`[${module.exports.data.name}] Loading ${funcLength} function${funcLength !== 1 ? 's' : ''}...`);

  // adding all functions
  jsfiles.forEach((f, i) => {
    // cleanup name
    const cleanName = f
      .replace(/\\|\//g, '_')
      .replace('functions_', '')
      .replace('.js', '');
    // abort entry if in disabled folder
    if (cleanName.search('archive_') !== -1) return;
    // get module functions and info
    const probs = require(`../../${f}`);
    LOG(`[${module.exports.data.name}]     ${i + 1}) Loaded: ${cleanName}!`);
    // adding function to collection
    client.functions.set(cleanName, probs);
  });

  LOG(`[${module.exports.data.name}] Loaded ${funcLength} function${funcLength !== 1 ? 's' : ''}!`);
};

module.exports.data = {
  name: 'initFunctions',
};
