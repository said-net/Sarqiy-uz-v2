const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
    from: {
        type: Types.ObjectId,
        ref: 'User'
    },
    count: Number,
    created: Number,
    card: String,
    status: {
        type: String,
        default: 'pending'
    }//reject || pending || success
});

module.exports = model('PayAdmin', schema);