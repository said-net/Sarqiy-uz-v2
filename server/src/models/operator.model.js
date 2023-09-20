const { default: mongoose, Schema } = require('mongoose');
const schema = new Schema({
    name: String,
    id: Number,
    phone: {
        type: String,
        unique: true,
    },
    password: String,
    access: String,
    telegram: String,
    balance: {
        type: Number,
        default: 0
    },
    super: {
        type: Boolean,
        default: false
    },
    hidden: {
        type: Boolean,
        default: false
    },
    card: String,
});
module.exports = mongoose.model('Operator', schema);