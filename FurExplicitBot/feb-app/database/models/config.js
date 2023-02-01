const configbase = require('./config/configbase')
const configvalue = require('./config/configvalue')

module.exports = {
    data: { name: 'config' },
    configbase: configbase,
    configvalue: configvalue,
    sync: async () => {
        configbase.hasMany(configvalue, { as: 'configvalues' });
        configvalue.belongsTo(configbase, {
            foreignKey: 'serverId',
            as: 'configbase'
        });
        await configbase.sync().catch(ERR);
        await configvalue.sync().catch(ERR);
    },
}