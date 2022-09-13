const mongoose = require('mongoose');

const RidgewoodClassSchema = new mongoose.Schema({
    className: {type: String},
    beltQualifier: {type: Array},
    dateScheduled: {type: Date},
    instructor: {type: String}
});

const RidgewoodClasses = mongoose.model('RidgewoodClasses', RidgewoodClassSchema);

module.exports = RidgewoodClasses;