var express = require('express');
var router = express.Router();
const UserController = require("../controllers/UserController");
const CoffeeController = require("../controllers/CoffeeController");
const PromoCodeController = require("../controllers/PromoCodeController");
const RatingController = require("../controllers/RatingsController");
const OrderController = require("../controllers/OrderController");

const auth = require("../middleware/validateRequest");

/**USER ROUTES */

router.post("/add_user", UserController.createUser);
router.post("/login", UserController.login);


/**COFFEE ROUTES */

router.post("/add_coffee",auth, CoffeeController.addCoffee);
router.post("/list_coffee",auth,CoffeeController.listCoffee);

/**PROMOCODE ROUTES */
router.post("/add_promocode",auth, PromoCodeController.addPromoCode);
router.get("/list_promocode",auth, PromoCodeController.listPromoCode);


/**RATING ROUTES */
router.post("/add_rating",auth,RatingController.addRatings);

/**ORDER ROUTES */
router.post("/add_order",auth,OrderController.addOrder);
router.get("/list_order",auth,OrderController.listOrder);

module.exports = router;