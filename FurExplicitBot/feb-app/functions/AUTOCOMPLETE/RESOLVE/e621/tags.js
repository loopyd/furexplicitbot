const axios = require('axios');

const url = config.engine.e621.autocompleteEndpoint;

module.exports = {
  data: { name: 'tags' },
  run: async (searchInput) => {
    const tagsRaw = searchInput.replaceAll(', ', ' ');
    const searchArray = tagsRaw.split(' ');
    const apiSearchVal = searchArray.pop();
    if (apiSearchVal.length <= 2) return [];
    const autocompletes = await axios({
      method: 'GET',
      url,
      headers: { 'User-Agent': `${config.package.name}/${config.package.version} by ${config.package.author} on GitHub` },
      params: {
        'search[name_matches]': apiSearchVal,
        expiry: 7,
      },
    });
    const output = autocompletes.data.map((entry) => {
      const value = `${searchArray.join(' ')}${searchArray.length === 0 ? '' : ' '}${entry.name}`;
      return { name: value, value };
    });
    return output;
  },
};