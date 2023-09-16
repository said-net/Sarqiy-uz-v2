const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    },
    flow: Number,
    views: {
        type: Number,
        default: 0
    }
});
module.exports = model('View', schema);