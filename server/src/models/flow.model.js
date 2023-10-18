const { Types: { ObjectId }, model, Schema } = require('mongoose');
const schema = new Schema({
    id: Number,
    title: String,
    from: {
        type: ObjectId,
        ref: 'User'
    },
    product: {
        type: ObjectId,
        ref: 'Product'
    },
    price: Number,
    for_admin: Number,
    created: Number,
    views: Number,
    delivery: {
        type: Boolean,
        default: false
    },
    hidden: {
        type: Boolean,
        default: false
    }
});
module.exports = model('Flow', schema);