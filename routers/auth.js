const express = require('express');
const router = express.Router();

router.get('/login',(req,res,next)=>{
    res.render('auth/login',{
      pageTitle:'Login',
      path:'/login'
    })
})
router.get('/signup',(req,res,next)=>{
    res.render('auth/signup',{
      pageTitle:'Signup',
      path:'/signup'
    })
})
exports.routes=router;