/*
File Name: app.js
Name: Mehak kaur 
Student ID 301232188
Date 20 October, 2022
*/

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let businessContactsRouter = require('./routes/businessContacts');
let app = express();

// IMPORTING PACKAGE MONGOOSE npm install --save mongoose
const mongoose = require('mongoose');

// IMPORTING USER SCHEMA FROM  user.js IN Models DIRECTORY
const User = require('./Models/user');

// IMPORTING bcryptjs to encrypt the password
const bcryptjs = require('bcryptjs');

// IMPORTING EXPRESS-SESSIONS TO CREATE LOGIN SESSIONS
var session = require('express-session');

// ADDING A FLASH MESSAGE
var flash = require('connect-flash');

// MONGODB CLUSTER LINK
const MONGODB_URI = 'mongodb+srv://MehakKaur:Mehak123@cluster0.8wazwtw.mongodb.net/portfolio?retryWrites=true&w=majority';
// STARTING A SESSION
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
  app.use(
    session({
      secret: 'my secret',
      resave: 'false',
      saveUninitialized: false,
      store: store
    })
  );


// ADDING AUTHENTICATION STATUS
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
})
// USING FLASH FUNCTION TO SEND RESPONSES TO USER
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(indexRouter);
app.use(businessContactsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });

});

module.exports = app;
// CONNECTING TO MONGODB USING MONGOOSE
mongoose.connect(MONGODB_URI)
  .then(result => {
    console.log('Connected !!');
    User.findOne()  // CHECKING IF THERE IS ANY USER DATA STORED IN DATABASE
      .then(user => {
        const password = '123456';
        bcryptjs.hash(password, 12).then(hashedPassword => {
          // IF NO USER FOUND IN DATABASE, WE WILL CREATE OUR FIRST USER
          if (!user) {
            const user = new User({
              username: 'Mehak',
              password: hashedPassword
            });
            user.save() // SAVING THE DATA TO MONGODB USING .save() mongoose function
              .then(result => {
                console.log(result);
              })
          }
        })
      })
  })
  .catch(err => {
    console.log('Some Error Occured In Connecting To The Database: ' + err);
  })