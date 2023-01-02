const express = require('express');
const path = require('path');
// IMPORTING THE MONGODB SETUP FUNCTION
const mongoConnect = require('./util/database').mongoConnect;

const app = express();
// MAKING THE CSS FOLDER PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./models/user');
app.use((req,res,next)=>{
  User.findById('6346c38fd86e623050393f76')
  .then(user=>{
    req.user=new User(user.name,user.email,user.cart,user._id);
    // console.log(req);
    next();
  })
  .catch(err=>{
    console.log(err);
  })
})
// SETTING THE VIEW ENGINE EJS
app.set('view engine', 'ejs');
app.set('views', 'views');


// Adding Body Parser
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended:false}))

// Import routes
const adminRoutes = require('./routers/admin');
const shopRoutes = require('./routers/shop');
const authRoutes = require('./routers/auth');
app.use(shopRoutes.routes);
app.use(adminRoutes.routes);
app.use(authRoutes.routes);

// ADDING ERRPR 404 PAGE
const errorController = require('./controller/error')
app.use(errorController.get404);


// STARTING THE SERVER AND CONNECTING TO MONGODB
mongoConnect(()=>{
  app.listen(2100);
})

