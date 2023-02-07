const axios = require('axios');

module.exports = {
  data: { name: 'rule34' },
  run: async (searchInput) => {
    const tagsRaw = searchInput.replaceAll(', ', ' ');
    const searchArray = tagsRaw.split(' ');
    const apiSearchVal = searchArray.pop();
    if (apiSearchVal.length <= 2) return [];
    const autocompletes = await axios({
      method: 'GET',
      url: config.engine.rule34.endpoint.autocomplete,
      headers: { 'User-Agent': `${config.package.name}/${config.package.version} by "Phil | Flipper#3621" on Discord` },
      params: {
        q: apiSearchVal,
        expiry: 7,
      },
    });
    const output = autocompletes.data.map((entry) => {
      const value = `${searchArray.join(' ')}${searchArray.length === 0 ? '' : ' '}${entry.value}`;
      return { name: value, value };
    });
    return output;
  },
};