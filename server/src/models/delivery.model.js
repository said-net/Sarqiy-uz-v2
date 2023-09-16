const { Schema, model } = require('mongoose');
const schema = new Schema({
    id: Number,
    name: String,
    price: {
        type: Number,
        default: 0
    }
})
module.exports = model('Delivery', schema)