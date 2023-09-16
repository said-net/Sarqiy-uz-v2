const { default: mongoose, Schema, Types } = require('mongoose');
const schema = new Schema({
    from: {
        type: Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    }
});
module.exports = mongoose.model('Like', schema);