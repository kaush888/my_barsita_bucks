// OWN IMPORT MODULES //

const mongoose = require('mongoose');


/**
 * @description: Coffee Schema
 * @author: kaushal
 */


const Schema = mongoose.Schema;
const CoffeeSchema = new Schema({
    coffeeName: {
        type: String,
        required: true
    },
    coffeeType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


var Coffee = mongoose.model("coffee", CoffeeSchema);

module.exports = Coffee;