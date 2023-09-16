const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    },
    media: String,
    about: String,
    type: String
});
module.exports= model('Ads', schema);