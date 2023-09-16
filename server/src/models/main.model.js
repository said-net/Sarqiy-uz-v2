const { model, Schema, Types } = require('mongoose');
const schema = new Schema({
    image: String,
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    }
});
module.exports = model('Main', schema)