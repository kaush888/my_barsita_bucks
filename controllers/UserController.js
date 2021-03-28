
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const Joi = require('joi')
const config = require("../config/configuration");
const constants = require("../config/constants");
const User = require("../models/UserModel");

/**
 * @description: User Registration
 * @author: kaushal
 */

exports.createUser = async (req, res) => {
    try {

        const user_schema = Joi.object({
            firstname: Joi.required(),
            lastname: Joi.required(),
            email: Joi.required(),
            password: Joi.required(),
            mobileNo: Joi.number().required()
        })

        let result = await user_schema.validate(req.body);
        if (result.error) {
            return res.status(constants.bad_request_code).send({
                error: "Invalid Request Data."
            });
        } else {
            await User.aggregate([

                {
                    '$match': {
                        '$or': [
                            {
                                'email': req.body.email
                            }, {
                                'mobileNo': parseInt(req.body.mobileNo)
                            }
                        ]
                    }
                }]).exec()
                .then(user => {
                    if (user.length) {
                        if (user[0].email == req.body.email) {

                            res.status(constants.conflict_code);
                            res.send({
                                status: constants.conflict_code,
                                message: "Email is already registered.",
                                success: false
                            });

                        } else if (user[0].mobileNo == parseInt(req.body.mobileNo)) {
                            res.status(constants.conflict_code);
                            res.send({
                                status: constants.conflict_code,
                                message: "Mobile number is already registered.",
                                success: false
                            });
                        }
                    } else {
                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                            if (err) {
                                return res.json({
                                    status: 500,
                                    error: err
                                });
                            }
                            var newusers = req.body;
                            newusers.password = hash
                            const users = new User(newusers);
                            users.save(function (err, success) {
                                if (err) {
                                    return res.status(constants.server_error_code).send({
                                        status: constants.server_error_code,
                                        message: "Something Went Wrong.",
                                        success: false
                                    });
                                } else {
                                    return res.status(constants.success_code).send({
                                        status: constants.success_code,
                                        message: "User Added Successfully.",
                                        success: true, data: success
                                    });

                                }
                            });
                        });
                    }
                })
        }

    } catch (err) {
        console.log("error in catch in .......", err);
        return res.status(constants.server_error_code).send({
            status: constants.server_error_code,
            message: "Something Went Wrong.",
            success: false
        });
    }

};



/**
 * @description: User Login
 * @author: kaushal
 */
exports.login = async (req, res) => {
    try {

        await User.findOne({
            $or: [
                { email: req.body.email },
                { mobileNo: req.body.mobileNo }
            ]
        }).exec(function (err, user) {
            if (user === null) {
                return res.status(constants.not_found_code).send({
                    status: constants.not_found_code,
                    message: "User Not Found",
                    success: false,
                });
            } else {
                bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
                    if (isMatch && !err) {
                        let token = jwt.sign({ _id: user._id }, config.JWT_ENCRYPTION, { expiresIn: 15 * 60 });
                        var convertedJSON = JSON.parse(JSON.stringify(user));
                        convertedJSON['token'] = token;

                        return res.status(constants.success_code).send({
                            status: constants.success_code,
                            message: "Login Successfully",
                            success: true,
                            data: convertedJSON
                        });

                    } else {
                        return res.status(constants.bad_request_code).send({
                            status: constants.bad_request_code,
                            message: "Mobile No or Email or Password Is Incorrect.",
                            success: false,
                        });
                    }

                })

            }
        });
    } catch (err) {
        console.log("error in catch in .......", err);
        return res.status(constants.server_error_code).send({
            status: constants.server_error_code,
            message: "Something Went Wrong.",
            success: false
        });
    }
};