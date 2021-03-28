const Joi = require('joi')
const constants = require("../config/constants");
const Order = require("../models/OrderModel");
const PromoCode = require("../models/PromoCodeModel");
var ObjectId = require("mongoose").Types.ObjectId;



/**
 * @description: Add Order
 * @author: kaushal
 */

exports.addOrder = async (req, res) => {
    try {

        const order_schema = Joi.object({
            coffee_id: Joi.required(),
            user_id: Joi.required(),
            orderAmount: Joi.number().required()
        })

        let result = await order_schema.validate(req.body);
        if (result.error) {
            return res.status(constants.bad_request_code).send({
                error: "Invalid Request Data."
            });
        } else {

            var {promocode} = req.body;

            var order = {};
    
            if(promocode){
    
                await PromoCode.findOne({promoCode:req.body.promocode}).then((response)=>{
    
                    if (response) {
                        order = {
                            user_id: req.body.user_id,
                            coffee_id: req.body.coffee_id,
                            promocode_id: response._id,
                            orderAmount: req.body.orderAmount,
                            paidAmount: req.body.orderAmount - (req.body.orderAmount * response.percentageOff / 100),
                        }
    
    
                    } else {
    
                        return res.status(constants.not_found_code).send({
                            status: constants.not_found_code,
                            message: "Promo Code not valid.",
                            success: false
                        });
                    }
    
                })
    
            }else{
                order = {
                    user_id: req.body.user_id,
                    coffee_id: req.body.coffee_id,
                    orderAmount: req.body.orderAmount,
                    paidAmount: req.body.orderAmount,
                }
            }
    
            const new_order = new Order(order);
    
            new_order.save(function (err,success) {
                if(err){
    
                    return res.status(constants.server_error_code).send({
                        status: constants.server_error_code,
                        message: "Something Went Wrong.",
                        success: false
                    });
                    
                }else{
                    return res.status(constants.success_code).send({
                        status: constants.success_code,
                        message: "Order has been placed successfully.",
                        success: true,
                        data:success
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
 * @description: List Order
 * @author: kaushal
 */


 exports.listOrder = async (req, res) => {
    try {

        const order_schema = Joi.object({
            user_id: Joi.required(),
        })

        let result = await order_schema.validate(req.body);
        if (result.error) {
            return res.status(constants.bad_request_code).send({
                error: "Invalid Request Data."
            });
        } else {

            await Order.aggregate([
                {
                    '$match':{
                        'user_id': ObjectId(req.body.user_id)
                    }
                }
            ]).then((response)=>{

                if(response.length > 0){
                    return res.status(constants.success_code).send({
                        status: constants.success_code,
                        message: "Order listed  successfully.",
                        success: true,
                        data:response
                    });
                }else{
                    return res.status(constants.no_content_code).send({
                        status: constants.no_content_code,
                        message: "No Data Found.",
                        success: false,
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