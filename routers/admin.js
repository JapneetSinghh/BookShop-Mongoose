const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const isAuth = require('../Middlewear/isAuth');

const { check, body } = require('express-validator/check');

router.get('/add-product', isAuth, adminController.getAddProudct);
router.post('/add-product',
    [
        check('productName', 'Title must be at least of 3 characters').isLength({ min: 3 }).trim(),
        check('productPrice', 'Enter a valid price').isFloat(),
        check('productLink', 'Invalid Image URL').isURL(),
        check('productDescription', 'Description must be atleast of 5 characters').isLength({ min: 5 }).trim(),
    ]
    , isAuth, adminController.postAddProducts);
router.get('/admin', isAuth, adminController.getAdmin);
router.post('/delete-product/:productId', isAuth, adminController.deleteProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product',
    [
        check('productName', 'Title must be at least of 3 characters').isLength({ min: 3 }).trim(),
        check('productPrice', 'Enter a valid price').isFloat(),
        check('productLink', 'Invalid Image URL').isURL(),
        check('productDescription', 'Description must be atleast of 5 characters').isLength({ min: 5 }).trim(),
    ]
    , isAuth, adminController.postEditProduct);
exports.routes = router