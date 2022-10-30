// IMPORTING PACKAGE BCRYPT FOR ENCRYPTING THE PASSWORD
// npm install --save bcryptjs
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require("../models/user");
const crypto = require('crypto');
// ACCEPTING VALIDATION REQUESTS
const { validationResult } = require('express-validator/check');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    let validation = req.flash('class');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false,
        message: message,
        inputs: {
            email: '',
            password: ''
        },
        validation: validation[0]
    })
}
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            isAuthenticated: false,
            message: errors.array()[0].msg,
            inputs: {
                email: email,
                password: password
            },
            validation: 'error'
        })
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid Email');
                console.log('Invalid Email');
                return res.render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    isAuthenticated: false,
                    message: 'Invalid Email',
                    inputs: {
                        email: email,
                        password: password
                    },
                    validation: 'error'
                })
            }
            console.log('Valid Email');
            console.log(user);
            bcrypt.compare(password, user.password)
                .then(domatch => {
                    console.log(domatch)
                    if (!domatch) {
                        req.flash('error', 'Invalid Password');
                        console.log('Invalid Password');
                        return res.render('auth/login', {
                            pageTitle: 'Login',
                            path: '/login',
                            isAuthenticated: false,
                            message: 'Invalid Email Or Password',
                            inputs: {
                                email: email,
                                password: password
                            },
                            validation: 'error'
                        })
                    }
                    else {
                        console.log('User Found Successfully');
                        req.session.isLoggedIn = true;
                        console.log(user);
                        req.session.user = user;
                        console.log(req.session);
                        res.redirect('/');
                    }
                })
                .catch(err => {
                    if (err) {
                        console.log(err);
                    }
                })
        })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        message: message,
        input: {
            username: '',
            password: '',
            email: '',
            confirmPassword: ''
        }
    })
}
exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return res.render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            message: errors.array()[0].msg,
            input: {
                username: username,
                password: password,
                email: email,
                confirmPassword: req.body.confirmPassword
            }
        })
    }

    bcrypt.hash(password, 12)
        .then(encryptedPassword => {
            return encryptedPassword;
        })
        .then(password => {
            User.findOne({ email: email })
                .then(userCheck => {
                    console.log(userCheck);
                    if (userCheck) {
                        console.log('USER EXISTS');
                        return res.render('auth/signup', {
                            pageTitle: 'Signup',
                            path: '/signup',
                            message: "Email Already Registered",
                            input: {
                                username: username,
                                password: password,
                                email: email,
                                confirmPassword: req.body.confirmPassword
                            }
                        })
                    }
                    const user = new User({
                        username: username,
                        email: email,
                        password: password,
                        cart: { items: [] }
                    })
                    user.save()
                        .then(result => {
                            console.log(result);
                            console.log('User added');
                            res.redirect('/login');
                        })
                })
        })

}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        console.log('SESSION DELETED')
        res.redirect('/login');
    });
}

exports.getResetPass = (req, res, next) => {
    let message = req.flash('error');
    let validation = req.flash('class');

    console.log(validation);
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/resetPass', {
        pageTitle: 'Reset Password',
        path: '/resetPass',
        isAuthenticated: false,
        message: message,
        validation: validation[0]
    })
}
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "a873fef7180cb4",
        pass: "9bdf5079579d29"
    }
});

exports.postResetPass = (req, res, next) => {
    const email = req.body.email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('auth/resetPass', {
            pageTitle: 'Login',
            path: '/login',
            isAuthenticated: false,
            message: errors.array()[0].msg,
            validation: 'error'
        })
    }
    let token;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/resetPass');
        }
        token = buffer.toString('hex');
    })

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', "Email Not Found");
                req.flash('class', 'error');
                return res.redirect('/resetPass');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            transport.sendMail({
                to: email,
                from: 'shop@node-complete.com',
                subject: 'Reset Password Request',
                html:
                    `
             <div style="background-color:rgb(236, 236, 236);padding: 20px;">
                <p style="font-size: 30px;text-align:center">Reset Password</p>
                <p><a href="localhost:2100/reset/${token}">Click Here To Reset Your Password</a> </p>
             </div>
                `
            })
            req.flash('error', "Link to reset password sent to your email");
            req.flash('class', 'success');
            return res.redirect('/resetPass');
        })
}


exports.getUpdatePassword = (req, res, next) => {
    let message = req.flash('error');
    let validation = req.flash('class');

    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                console.log('Invalid Reset Request');
                req.flash('error', 'Token Invalid Or Expired');
                req.flash('class', 'error');
                return res.redirect('/resetPass');
            }
            res.render('auth/new-password', {
                pageTitle: 'New Password',
                path: '/reset',
                isAuthenticated: false,
                message: message,
                validation: validation[0],
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            console.log(err);
        })

}
exports.postUpdatePassword = (req, res, next) => {
    const newPassword = req.body.newPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser ;
    const errors = validationResult(req);
    console.log(newPassword);
    console.log(errors);
    if (!errors.isEmpty()) {
        res.render('auth/new-password', {
            pageTitle: 'New Password',
            path: '/reset',
            isAuthenticated: false,
            message: errors.array()[0].msg,
            validation: 'error',
            userId: userId,
            passwordToken: passwordToken
        })
    }

    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            if (!user) {
                req.flash('error', 'Try Again');
                req.flash('class', 'error');
                return res.redirect('/resetPass');
            }
           resetUser=user;
           return bcrypt.hash(newPassword,12)
        })
        .then(newPassword=>{
            resetUser.password=newPassword;
            resetUser.resetToken=undefined;
            resetUser.resetTokenExpiration=undefined;
            return resetUser.save();
        })
        .then(result=>{
            req.flash('error', 'Password Has Been Updated');
            req.flash('class', 'success');
          return  res.redirect('/login');
        })
        .catch(err => {
            console.log(err)
        })
}