const mongoose = require('mongoose');

const RidgewoodClassSchema = new mongoose.Schema({
    className: {type: String},
    time: {type: String},
    beltQualifier: {type: Array},
    dateScheduled: {type: Date},
});

const RidgewoodClasses = mongoose.model('RidgewoodClasses', RidgewoodClassSchema);

module.exports = RidgewoodClasses;