// OWN IMPORT MODULES //


const mongoose = require('mongoose');

var validateEmail = function (email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email)
};



/**
 * @description: User Schema
 * @author: kaushal
 */


const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Email address is required'],
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true
    },


}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


var User = mongoose.model("user", UserSchema);

module.exports = User;