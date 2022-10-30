const express = require('express');
const router = express.Router();
const shopController=require('../controller/shop');
const isAuth = require('../Middlewear/isAuth');

router.get('/',shopController.getProducts);
router.get('/cart',isAuth,shopController.getCart);
router.post('/addToCart',isAuth,shopController.getAddToCart);
router.post('/removeFromCart',isAuth,shopController.getRemoveFromCart);
router.get('/getDetails/:productId',shopController.getDetails);
router.post('/orderNow',isAuth,shopController.postOrder);
router.get('/orders',isAuth,shopController.getOrder);
exports.routes = router;