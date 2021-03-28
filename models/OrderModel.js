// OWN IMPORT MODULES //

const mongoose = require('mongoose');


/**
 * @description: Order Schema
 * @author: kaushal
 */


const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    coffee_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    promocode_id: {
        type: Schema.Types.ObjectId,
        ref: 'promoCode'
    },
    orderAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


var Order = mongoose.model("order", OrderSchema);

module.exports = Order;