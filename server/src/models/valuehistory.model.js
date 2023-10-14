const { Types, Schema, model } = require('mongoose');
const schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    },
    value: Number,
    created: Number
});
module.exports = model('Vhistory', schema);