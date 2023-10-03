const { default: mongoose, Schema } = require('mongoose');
const schema = new Schema({
    id: Number,
    name: String,
    phone: {
        type: String,
        unique: true,
    },
    password: String,
    access: String,
    owner: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Boss', schema);