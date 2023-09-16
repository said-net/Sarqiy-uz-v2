const { Schema, model } = require('mongoose');
const schema = new Schema({
    for_operators: Number,
    for_ref: {
        type: Number,
        default: 1000
    },
});
module.exports = model('Settings', schema);