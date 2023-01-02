const express = require('express');
const router = express.Router();
const shopController=require('../controller/shop');

router.get('/',shopController.getProducts);
router.get('/cart',shopController.getCart);
router.post('/addToCart',shopController.getAddToCart);
router.post('/removeFromCart',shopController.getRemoveFromCart);
router.get('/getDetails/:productId',shopController.getDetails);
router.post('/orderNow',shopController.addOrder);
router.get('/orders',shopController.getOrders);
exports.routes = router;