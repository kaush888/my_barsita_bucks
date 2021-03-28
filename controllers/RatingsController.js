const Joi = require('joi')
const constants = require("../config/constants");
const Ratings = require("../models/RatingsModel");


/**
 * @description: Add Ratings
 * @author: kaushal
 */

exports.addRatings = async (req, res) => {
    try {

        const rating_schema = Joi.object({
            coffee_id: Joi.required(),
            user_id: Joi.required(),
            ratings: Joi.number().required()
        })

        let result = await rating_schema.validate(req.body);
        if (result.error) {
            return res.status(constants.bad_request_code).send({
                error: "Invalid Request Data."
            });
        } else {

            await Ratings.findOne({ coffee_id: req.body.coffee_id, user_id: req.body.user_id }).then(async (rating) => {

                if (rating) {
                    await Ratings.updateOne({ coffee_id: req.body.coffee_id, user_id: req.body.user_id }, {
                        $set: {
                            ratings: req.body.ratings
                        }
                    }, { new: true }).then(async (response) => {
                        var updatedRating = await Ratings.findOne({ coffee_id: req.body.coffee_id, user_id: req.body.user_id })
                        return res.status(constants.success_code).send({
                            status: constants.success_code,
                            message: "Rating Updated Successfully.",
                            success: true,
                            data: updatedRating
                        });
                    })


                } else {

                    var newRating = req.body;
                    const new_rating = new Ratings(newRating);
                    new_rating.save(function (err, success) {
                        if (err) {
                            return res.status(constants.server_error_code).send({
                                status: constants.server_error_code,
                                message: "Something Went Wrong.",
                                success: false
                            });
                        } else {
                            return res.status(constants.success_code).send({
                                status: constants.success_code,
                                message: "Rating Added Successfully.",
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