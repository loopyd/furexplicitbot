const autopostbase = require('./autopost/autopostbase');
const autoposte621 = require('./autopost/autoposte621');
const autopostfa = require('./autopost/autopostfa');
const autopostsource = require('./autopost/autopostsource');

module.exports = {
    data: { name: 'autopost' },
    autopostbase: autopostbase,
    autoposte621: autoposte621,
    autopostfa: autopostfa,
    autopostsource: autopostsource,
    sync: async () => {
        autopostbase.hasMany(autoposte621, { as: 'autopostse621' } );
        autoposte621.belongsTo(autopostbase, {
            foreignKey: 'ID',
            as: 'autopostbase',
        });
        autopostbase.hasMany(autopostfa, { as: 'autopostsfa' } );
        autopostfa.belongsTo(autopostbase, {
            foreignKey: 'ID',
            as: 'autopostbase'
        });
        autopostbase.hasMany(autopostsource, { as: 'autopostssource' } );
        autopostsource.belongsTo(autopostbase, {
            foreignKey: 'ID',
            as: 'autopostbase'
        });
        await autopostbase.sync();
        await autoposte621.sync();
        await autopostfa.sync();
        await autopostsource.sync();
    }
}