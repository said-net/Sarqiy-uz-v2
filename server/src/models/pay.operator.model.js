const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
    from: {
        type: Types.ObjectId,
        ref: 'Operator'
    },
    count: Number,
    created: Number,
    card: Number,
    comment: {
        type: String,
        default: 'Pul chiqarish uchun sorov'
    },
    status: {
        type: String,
        default: 'pending'
    }//reject || pending || success
});

module.exports = model('PayOperator', schema);