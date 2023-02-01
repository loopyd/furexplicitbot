const autopostbase = require('./autopost/autopostbase');
const autoposte621 = require('./autopost/autoposte621');
const autopostfa = require('./autopost/autopostfa');
const autopostsource = require('./autopost/autopostsource');

autopostbase.hasMany(autoposte621);
autoposte621.belongsTo(autopostbase, { foreignKey: 'ID' });
autopostbase.hasMany(autopostfa);
autopostfa.belongsTo(autopostbase, { foreignKey: 'ID' });
autopostbase.hasMany(autopostsource);
autopostsource.belongsTo(autopostbase, { foreignKey: 'ID' });

module.exports = {
    data: { name: 'autopost' },
    autopostbase: autopostbase,
    autoposte621: autoposte621,
    autopostfa: autopostfa,
    autopostsource: autopostsource,
    sync: async () => {
        await autopostbase.sync();
        await autoposte621.sync();
        await autopostfa.sync();
        await autopostsource.sync();
    }
}