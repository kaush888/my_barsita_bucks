const Joi = require('joi')
const constants = require("../config/constants");
const Coffee = require("../models/CoffeeModel");
const Order = require("../models/OrderModel");
var ObjectId = require("mongoose").Types.ObjectId;


/**
 * @description: Add Coffee
 * @author: kaushal
 */

exports.addCoffee = async (req, res) => {
    try {

        const coffee_schema = Joi.object({
            coffeeName: Joi.required(),
            coffeeType: Joi.required(),
            price: Joi.number().required()
        })

        let result = await coffee_schema.validate(req.body);
        if (result.error) {
            return res.status(constants.bad_request_code).send({
                error: "Invalid Request Data."
            });
            return
        } else {
            await Coffee.aggregate([

                {
                    '$match': {
                        'coffeeName': req.body.coffeeName
                    }
                }]).exec()
                .then(coffee => {
                    if (coffee.length > 0) {
                        if (coffee[0].coffeeName == req.body.coffeeName) {

                            return res.status(constants.conflict_code).send({
                                status: constants.conflict_code,
                                message: "Coffee is already exists.",
                                success: false
                            });

                        }
                    } else {
                        var newCoffee = req.body;
                        const coffees = new Coffee(newCoffee);
                        coffees.save(function (err, success) {
                            if (err) {
                                return res.status(constants.server_error_code).send({
                                    status: constants.server_error_code,
                                    message: "Something Went Wrong.",
                                    success: false
                                });
                            } else {
                                return res.status(constants.success_code).send({
                                    status: constants.success_code,
                                    message: "Coffee Added Successfully.",
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
 * @description: List Coffee
 * @author: kaushal
 */

exports.listCoffee = async (req, res) => {
    try {

        var search = req.body.search;
        var user_id = req.body.user_id;

        var past_orders = await Order.aggregate([
            {
                '$match': {
                    user_id: ObjectId(user_id)
                }
            }, {
                '$group': {
                    '_id': '$coffee_id',
                }
            },
            {
                '$addFields': {
                    'coffeeId': '$_id'
                }
            },
            {
                '$lookup': {
                    'from': 'coffees',
                    'localField': 'coffeeId',
                    'foreignField': '_id',
                    'as': 'coffee'
                }
            }, {
                '$unwind': {
                    'path': '$coffee',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'ratings',
                    'localField': 'coffeeId',
                    'foreignField': 'coffee_id',
                    'as': 'coffeeRating'
                }
            },
            {
                '$addFields': {
                    'rating': {
                        '$divide': [
                            {
                                '$reduce': {
                                    'input': '$coffeeRating',
                                    'initialValue': 0,
                                    'in': {
                                        '$add': [
                                            '$$value', '$$this.ratings'
                                        ]
                                    }
                                }
                            }, {
                                '$cond': [
                                    {
                                        '$ne': [
                                            {
                                                '$size': '$coffeeRating'
                                            }, 0
                                        ]
                                    }, {
                                        '$size': '$coffeeRating'
                                    }, 1
                                ]
                            }
                        ]
                    },
                }
            }, {
                '$project': {
                    '_id': 0,
                    'coffee._id': 1,
                    'coffee.coffeeName': 1,
                    'coffee.coffeeType': 1,
                    'coffee.price': 1,
                    'rating': 1,
                    'coffee.created_at': 1,
                    'coffee.updated_at': 1,

                }
            }, {
                '$addFields': {
                    'coffee_id': '$coffee._id',
                    'coffeName': '$coffee.coffeeName',
                    'coffeeType': '$coffee.coffeeType',
                    'price': '$coffee.price',
                    'ratings': '$rating',
                    'created_at': '$coffee.created_at',
                    'updated_at': '$coffee.updated_at',

                }
            }, {
                '$project': {
                    '_id': 0,
                    'rating': 0,
                    'coffee': 0
                }
            },
            { $sort: { created_at: -1 } }
        ])

        await Coffee.aggregate([

            {
                '$match': {
                    $or: [
                        { coffeeName: new RegExp(search, "i") },
                        { coffeeType: new RegExp(search, "i") }
                    ]
                }
            }, {
                '$lookup': {
                    'from': 'ratings',
                    'localField': '_id',
                    'foreignField': 'coffee_id',
                    'as': 'coffeeRating'
                }
            },
            {
                '$addFields': {
                    'rating': {
                        '$divide': [
                            {
                                '$reduce': {
                                    'input': '$coffeeRating',
                                    'initialValue': 0,
                                    'in': {
                                        '$add': [
                                            '$$value', '$$this.ratings'
                                        ]
                                    }
                                }
                            }, {
                                '$cond': [
                                    {
                                        '$ne': [
                                            {
                                                '$size': '$coffeeRating'
                                            }, 0
                                        ]
                                    }, {
                                        '$size': '$coffeeRating'
                                    }, 1
                                ]
                            }
                        ]
                    },
                }
            }, {
                '$project': {
                    '_id': 1,
                    'coffeeName': 1,
                    'coffeeType': 1,
                    'price': 1,
                    'rating': 1,
                    'created_at': 1,
                    'updated_at': 1,
                }
            }, {
                '$addFields': {
                    'coffee_id': '$_id',
                    'ratings': '$rating',
                    'created_at': '$created_at',
                    'updated_at': '$updated_at',

                }
            },{
                '$project':{
                    '_id':0,
                    'rating':0
                }
            },
            { $sort: { created_at: -1 } }

        ]).exec()
            .then(coffee => {

                if(coffee.length > 0){
                    return res.status(constants.success_code).send({
                        status: constants.success_code,
                        message: "Coffee Listed Successfully.",
                        success: true, data: {
                            suggested_coffees: past_orders,
                            coffees: coffee
    
                        }
                    });
                }else{
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