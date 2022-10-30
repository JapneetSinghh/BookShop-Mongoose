const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

// IMPORTING EXPRESS VALIDATOR
const { check, body } = require('express-validator/check');

router.get('/login', authController.getLogin);
router.post('/login',
    [
        body('email').isEmail().withMessage('Please Enter A Valid Email'),
        body('password', 'Please enter a valid password').isLength({ min: 5 }).isAlphanumeric()
    ]
    , authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        body('email').isEmail().withMessage('Please Enter A Valid Email'),
        body('password', 'Please enter a password with only numbers and text with at least 5 characters').isLength({ min: 5 }).isAlphanumeric(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords Have To Match');
            }
            return true;
        })
    ]
    , authController.postSignup);
router.post('/logout', authController.postLogout);

router.get('/resetPass', authController.getResetPass);
router.post('/resetPass', body('email').isEmail().withMessage('Please Enter A Valid Email'), authController.postResetPass);
router.get('/reset/:token',authController.getUpdatePassword);

router.post('/newPassword',
[
    body('newPassword', 'Please enter a password with only numbers and text with at least 5 characters').isLength({ min: 5 }).isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Passwords Have To Match');
        }
        return true;
    })
]
,authController.postUpdatePassword);
exports.routes = router;