const { model, Schema } = require('mongoose');
const schema = new Schema({
    id: Number,
    name: String,
    phone: {
        type: String,
        unique: true
    },
    password: String,
    access: String,
    region: Number
});
module.exports = model('Courier', schema);