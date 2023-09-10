const JWT = require('jsonwebtoken')
let AuthToken = null;
class AuthenticationToken {
    static getAuthServicesInstance(){
        return AuthToken? AuthToken : new AuthenticationToken()
    }
    signAccessToken(email){
     
        return JWT.sign({username:email},"my secret",{expiresIn:"2h"});

    }

   decodeToken(req){
        const accessToken = req.cookies.token;
        console.log(accessToken)
        if(accessToken){
           const decodedToken = JWT.verify(accessToken ,"my secret",(err,decodedToken) => {
               if(!err){
                    console.log(decodedToken,"decodedToken")
                   return decodedToken
               }
               
               return null
           })
           return decodedToken
           
       }
       else{
           return null
       }
   }
    
}

module.exports=AuthenticationToken