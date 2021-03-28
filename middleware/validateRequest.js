const jwt = require('jsonwebtoken');
const config = require("../config/configuration");
const constants = require("../config/constants");

module.exports = async function (req, res, next) {

    var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['token'];
    if (token) {
        try {

            jwt.verify(token, config.JWT_ENCRYPTION, async function (err, decoded) {

                if (err) {
                    return res.status(constants.unauthorized_code).send({
                        status: constants.unauthorized_code,
                        message: "Your Token is expired.",
                        success: false,
                    });
                  

                } else { 
                    next()
                }

            });

        } catch (err) {
            console.log("🚀 ~ file: validateRequestCMS.js ~ line 32 ~ err", err)
            return res.status(constants.server_error_code).send({
                status: constants.server_error_code,
                message: "Something went wrong.",
                success: false,
            });
        }
    } else {
        return res.status(constants.forbidden_code).send({
            status: constants.forbidden_code,
            message: "No token provided",
            success: false,
        });
    }
};