const { Schema, model } = require('mongoose');
const schema = new Schema({
    id: {
        type: Number,
        unique: true
    }
});
module.exports = model('TGUser', schema);