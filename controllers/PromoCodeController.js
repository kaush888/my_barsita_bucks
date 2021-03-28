const Joi = require('joi')
const constants = require("../config/constants");
const PromoCode = require("../models/PromoCodeModel");


/**
 * @description: Add PromoCode
 * @author: kaushal
 */

 exports.addPromoCode = async (req, res) => {
    try {

        const promocode_schema = Joi.object({
            promoCode: Joi.required(),
            percentageOff: Joi.number().required()
        })

        let result = await promocode_schema.validate(req.body);
        if (result.error) {
            return  res.status(constants.bad_request_code).send({
                error: "Invalid Request Data."
            });
            return
        } else {
            await PromoCode.aggregate([

                {
                    '$match': {
                        'promoCode':req.body.promoCode
                    }
                }]).exec()
                .then(promoCodes => {
                    if (promoCodes.length > 0) {
                        if (promoCodes[0].promoCode == req.body.promoCode) {

                            return res.status(constants.conflict_code).send({
                                status: constants.conflict_code,
                                message: "PromoCode is already exists.",
                                success: false
                            });

                        }
                    } else {
                        var newPromoCode = req.body;
                        const promocodes = new PromoCode(newPromoCode);
                        promocodes.save(function (err, success) {
                            if (err) {
                                return res.status(constants.server_error_code).send({
                                    status: constants.server_error_code,
                                    message: "Something Went Wrong.",
                                    success: false
                                });
                            } else {
                                return  res.status(constants.success_code).send({
                                    status: constants.success_code,
                                    message: "PromoCode Added Successfully.",
                                    success: true, data: success
                                });

                            }
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
 * @description: List PromoCode
 * @author: kaushal
 */

 exports.listPromoCode = async (req, res) => {
    try {

        await PromoCode.find().exec()
            .then(promoCodes => {
                if (promoCodes.length > 0) {
                    return res.status(constants.success_code).send({
                        status: constants.success_code,
                        message: "PromoCodes Listed Successfully.",
                        success: true,
                        data:promoCodes
                    });
                } else {
                    return res.status(constants.no_content_code).send({
                        status: constants.no_content_code,
                        message: "No Data Found.",
                        success: false,
                    });
                }
            })

    } catch (err) {
        console.log("error in catch in .......", err);
        return res.status(constants.server_error_code).send({
            status: constants.server_error_code,
            message: "Something Went Wrong.",
            success: false
        });
    }

};