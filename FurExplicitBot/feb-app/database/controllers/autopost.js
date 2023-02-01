const autopost = require('../models/autopost');

exports.autopostcontroller = {
    createOrUpdate: (autoposts) => {
        autoposts.forEach((autop) => {
            let result = await autopost.findByPk(autop.)
        });
    },
    delete: (req, res) => {
    },
    get: (req, res) => {
    },
}
