module.exports = (req,res,next)=>{
    if(req.session.isLoggedIn!==true){
        console.log('NOT AUTHENTICATED');
        req.flash('error','Login To Access');
        return res.redirect('/login');
    }
    console.log('AUTHENTICATED');
    next();
}