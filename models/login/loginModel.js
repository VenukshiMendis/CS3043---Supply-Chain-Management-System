let loginUserInstance = null;
//const connection = require('../../connection');
class Login{
    static getLoginUserInstance(){
        return loginUserInstance ? loginUserInstance : new Login();
    }
    
    

    async getUser(email,connection) {
        console.log(email+"here");
        return new Promise(function(resolve, reject){

            connection.query("select * from loginuser where user_name = ? ",[email],function(error,results,fields){
                
                if (error) {
                    
                    reject(error);
                }
                console.log(results)
                resolve(results) ;
            });

        })  
    }

}

module.exports = Login;


