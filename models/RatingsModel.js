// OWN IMPORT MODULES //

const mongoose = require('mongoose');


/**
 * @description: Rating Schema
 * @author: kaushal
 */


const Schema = mongoose.Schema;
const RatingSchema = new Schema({
    coffee_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    ratings: {
        type: Number,
        required: true
    }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


var Ratings = mongoose.model("rating", RatingSchema);

module.exports = Ratings;