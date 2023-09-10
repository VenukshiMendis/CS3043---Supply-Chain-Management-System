const bodyParser = require("body-parser");
//const encoder = bodyParser.urlencoded();
const bcrypt = require('bcrypt');
const connection = require('../../connection');
//const Login = require("../../models/login/loginModel");
const loginmodel = require('../../models/login/loginModel');
const login = loginmodel.getLoginUserInstance();
const JWT = require('jsonwebtoken')

const authToken = require('../AuthenticationToken/authToken').getAuthServicesInstance();



//const login = new loginmodel();

module.exports.login_get = (req,res) => {
    res.render("login/index.ejs")
}

module.exports.login_post = (req,res) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);
    
  

    //implement-autheticate
    
    
    login.getUser(username,connection)
    .then(results=> { 
        console.log("hello"+results[0].user_pass) 
        
        let bool = bcrypt.compareSync(password, results[0].user_pass);
        console.log(bool)
        if(bool){
            const accessToken = authToken.signAccessToken(username);
            console.log(accessToken)
            res.cookie("token", accessToken , { httpOnly : true , maxAge:90000000})
            console.log("here")
            
            //CHECKS AND RENDERS - complete 
            if(results[0].role_name=='Customer'){
                res.render("customer/customermain.ejs");
            }

            else if(results[0].role_name == 'store_manager'){
                //check-if a storemanager 
                res.render("storemanager/storemanagermain.ejs");
            } 

            else if(results[0].role_name=='Driver'){      
                res.render("driver/driverWelcome.ejs");
            }
            
            else if(results[0].role_name=='Driver_assistant'){       
                res.render("driverAssistant/driverAssistantWelcome.ejs");
                
            }
            else if(results[0].role_name=='Manager'){       
                res.render("manager/managermain.ejs");
                
            }

        }
        else{
            res.send("Invalid usename or password")
        }
       
        
       
    })
    .catch(error=>{console.log(error+"err")})

   
   /* connection.query("select * from loginuser where user_name = ? ",[username],function(error,results,fields){
        console.log(results);
        if(!error){
            if (results.length <= 0 || results[0].user_pass != password) {
                return res.status(401).json({message :"Inavlid Username or Paasword"});

            }
            
            else if (results[0].user_pass == password){
                res.render("customer/customermain.ejs");
              
            }
            else{
                return res.status(400).json({message :"Something went wrong"});
            }
        }
        else{ 
            return res.status(500).json(error);  
            }
        res.end();
    })*/
}
 //implement logout