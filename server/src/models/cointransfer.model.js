const { Types: { ObjectId }, model, Schema } = require('mongoose');
const schema = new Schema({
    coin: Number,
    from: {
        type: ObjectId,
        ref: 'User'
    }
});
module.exports = model('Cointransfer', schema)