const {default: mongoose, Schema} = require('mongoose');
const schema = new Schema({
    name: String,
    phone: {
        type: String,
        unique: true,
    },
    password: String,
    access: String
});
module.exports = mongoose.model('Boss', schema);