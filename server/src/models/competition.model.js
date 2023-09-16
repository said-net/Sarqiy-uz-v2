const { model, Schema } = require('mongoose');
const schema = new Schema({
    title: String,
    about: String,
    image: String,
    start: Number,
    end: Number,
});
module.exports = model('Competition', schema);