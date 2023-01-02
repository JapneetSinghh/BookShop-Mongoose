const express = require('express');
const path = require('path');
// IMPORTING THE MONGODB SETUP FUNCTION
const mongoose = require('mongoose');
const app = express();
// Importing connect-flash
const flash = require('connect-flash');

// MAKING THE CSS FOLDER PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

// IMPORT csurf package
const csrf = require('csurf');

// IMPORTING express-session PACKAGE TO CREATE A SESSION WHEN USER LOGS IN
// npm install --save express-session
const session = require('express-session');
const MONGODB_URI = 'mongodb+srv://japneetsinghh:sidak123@cluster0.asyxflg.mongodb.net/?retryWrites=true&w=majority'

// IMPORTING PACKAGE connect-mongodb-session
// npm install --save connect-mongodb-session
const MongoDbStore = require('connect-mongodb-session')(session);

// Creating a new connection to mongodb server
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

// npm install cookie-parser
var cookieParser = require('cookie-parser')
app.use(cookieParser());
//  STARTING THE SESSION
app.use(
  session({
    secret: 'my secret',
    resave: 'false',
    saveUninitialized: false,
    store: store
  })
);


const User = require('./models/user');
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  res.locals.username = req.session.user.username;
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      // console.log(req);
      next();
    })
    .catch(err => {
      console.log(err);
    })
})

// SETTING THE VIEW ENGINE EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Adding Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

// USING THE CSRF TOKEN
const csrfProtection = csrf();
app.use(csrfProtection);
app.use(flash());

// SETTING THE AUTHENTICATION STATUS FOR ALL PAGES
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

// Import routes
const adminRoutes = require('./routers/admin');
const shopRoutes = require('./routers/shop');
const authRoutes = require('./routers/auth');
app.use('/', authRoutes.routes);
app.use('/', shopRoutes.routes);
app.use(adminRoutes.routes);

// ADDING ERRPR 404 PAGE
const errorController = require('./controller/error');
app.use(errorController.get404);


// STARTING THE SERVER AND CONNECTING TO MONGODB
// mongoConnect(()=>{
// })
const bcrypt = require('bcryptjs');

mongoose.connect(MONGODB_URI)
  .then(res => {
    console.log('Connected to mongoose !!');
    User.findOne()
      .then(user => {
        if (!user) {
          let password = '123456';
          bcrypt.hash(password, 12)
            .then(hashedPassword => {
              console.log('NO USER WAS THERE, SOO ADDING A NEW USER');
              const user = new User({
                username: 'Japneet Singh',
                email: 'japneet8208@gmail.com',
                password: hashedPassword,
                cart: { items: [] }
              })
              user.save();
            })
        }
      })
  })
  .then(result => {
    const port = process.env.PORT || 2100;
    app.listen(port, () => console.log(
      'listening on port 2100'))
  })
  .catch(err => {
    console.log(err);
  })
