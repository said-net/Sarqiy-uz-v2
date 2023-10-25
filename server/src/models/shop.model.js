const { Types, Schema, model } = require('mongoose');
const schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    },
    id: Number,
    from: String,
    name: String,
    about: String,
    month: Number,
    year: Number,
    day: Number,
    title: String,
    competition: {
        type: Types.ObjectId,
        ref: 'Competition'
    },
    price: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 1
    },
    region: Number,
    city: String,
    phone: String,
    week: Number,
    flow: {
        type: Number,
        default: 0
    },
    for_operator: {
        type: Number,
        default: 0
    },
    for_admin: {
        type: Number,
        default: 0
    },
    ref_id: {
        type: Number,
        default: 0
    },
    for_ref: {
        type: Number,
        default: 0
    },
    bonus: {
        type: Number,
        default: 0
    },
    created: Number,
    operator: {
        type: Types.ObjectId,
        ref: 'Operator'
    },
    courier_comment: String,
    recontact: Number,
    delivery_price: Number,
    up_time: Number,
    courier: {
        type: Types?.ObjectId,
        ref: 'Courier'
    },
    verified: {
        type: Boolean,
        default: false
    },
    courier_status: {
        type: String,
        default: 'sended'
    },
    status: {
        type: String,
        default: 'pending'
    },//copy, archive, reject, wait, pending,success, sended, delivered,
    flow_id: {
        type: Types.ObjectId,
        ref: 'Flow'
    },
    old_order: Number
})
module.exports = model('ShopHistory', schema)