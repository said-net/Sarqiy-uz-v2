const { model, Schema, Types, models } = require('mongoose');
const schema = new Schema({
    id: Number,
    title: String,
    old_price: Number,
    price: Number,
    image: String,
    user: {
        type: Types?.ObjectId,
        ref: 'User'
    },
    hidden: {
        type: Boolean,
        default: false
    }
});
module.exports = model('Race', schema)