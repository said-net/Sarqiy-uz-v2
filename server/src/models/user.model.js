const { Schema, model } = require('mongoose');

const schema = new Schema({
    id: Number,
    name: String,
    phone: String,
    location: Number,
    verify_code: String,
    created: Number,
    telegram: Number,
    balance: {
        type: Number,
        default: 0
    },
    password: String,
    ref_id: String,
    access: String,
    step: String,
    etc: Object,
    targetolog: {
        type: Boolean, 
        default: false
    }
});

module.exports = model('User', schema);