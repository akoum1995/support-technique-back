const mongoose = require('mongoose');

const intervention = new mongoose.Schema({
    date_intervention: {type: Number, default: Date.now()},
    pv: {type: String}
});

module.exports = mongoose.model('intervention', intervention);