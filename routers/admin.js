const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
router.get('/add-product',adminController.getAddProudct);
router.post('/add-product',adminController.postAddProducts);
router.get('/admin',adminController.getAdmin);
router.post('/delete-product/:productId',adminController.deleteProduct);
router.get('/edit-product/:productId',adminController.getEditProduct);
router.post('/edit-product',adminController.postEditProduct);
exports.routes = router