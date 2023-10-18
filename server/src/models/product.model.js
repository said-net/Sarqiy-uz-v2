const { Types, Schema, model } = require('mongoose');
const schema = new Schema({
    title: String,
    id: Number,
    about: String,
    images: Array,
    video: String,
    price: Number,
    value: Number,
    for_admins: Number,
    for_operators: {
        type: Number,
        default: 0
    },
    category: {
        type: Types.ObjectId,
        ref: 'Category'
    },
    original_price: Number,
    old_price: Number,
    bonus: {
        type: Boolean,
        default: false,
    },
    bonus_about: String,
    bonus_count: Number,
    bonus_given: Number,
    bonus_duration: Number,
    created: Number,
    delivery_price: Number,
    coin: {
        type: Number,
        default: 0
    },
    solded: {
        type: Number,
        default: 0,
    },
    hidden: {
        type: Boolean,
        default: false,
    },
});
module.exports = model('Product', schema);