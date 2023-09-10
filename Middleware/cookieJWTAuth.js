const JWT = require('jsonwebtoken')

exports.cookieJwtAuth = (req,res,next)=>{
    const token = req.cookies.token;
    try{
        const user= JWT.verify(token,"my secret");
        console.log(user.username)
        req.user=user;
        next()
    }
    catch(err){
        res.clearCookie("token");
        return res.redirect("/");
    }
};