// OWN IMPORT MODULES //

const mongoose = require('mongoose');


/**
 * @description: Promocode Schema
 * @author: kaushal
 */


const Schema = mongoose.Schema;
const PromoCodeSchema = new Schema({
    promoCode: {
        type: String,
        required: true
    },
    percentageOff: {
        type: Number,
        required: true
    }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


var PromoCode = mongoose.model("promoCode", PromoCodeSchema);

module.exports = PromoCode;