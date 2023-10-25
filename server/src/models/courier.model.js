const { model, Schema } = require('mongoose');
const schema = new Schema({
    id: Number,
    name: String,
    phone: {
        type: String,
        unique: true
    },
    password: String,
    telegram: String,
    access: String,
    region: Number,
    card: String,
});
module.exports = model('Courier', schema);