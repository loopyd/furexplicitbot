// TODO: FIXME: decide waht to implement and send off to IB: comma seperated, space seperated or both
//  issues: inkbunny has spaces in tags and seperates with commas. since the user gets to edit it afterwards its not easy to implement

const axios = require('axios');

module.exports = {
  data: { name: 'inkbunny' },
  run: async (searchInput) => {
    const tagsRaw = searchInput.replaceAll('_', ' ').replaceAll('_', ' ');
    const searchArray = tagsRaw.split(' ');
    const apiSearchVal = searchArray.pop();
    if (apiSearchVal.length <= 2) return [];
    const autocompletes = await axios({
      method: 'GET',
      url: config.engine.inkbunny.endpoint.autocomplete,
      headers: { 'User-Agent': `${config.package.name}/${config.package.version} by ${config.package.author} on GitHub` },
      params: {
        ratingsmask: '11111',
        keyword: tagsRaw,
      },
    });
    const output = autocompletes.data.results.slice(0, 24).map((entry) => {
      const filteredValue = entry.value.replaceAll(' ', '_');
      const value = `${searchArray.join(' ')}${searchArray.length === 0 ? '' : ' '}${filteredValue}`;
      return { name: value, value };
    });
    return output;
  },
};