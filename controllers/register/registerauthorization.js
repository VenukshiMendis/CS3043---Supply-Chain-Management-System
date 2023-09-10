const bodyParser = require("body-parser");
//const encoder = bodyParser.urlencoded();
const bcrypt = require('bcrypt');
const connection = require('../../connection');

const loginmodel = require('../../models/login/loginModel');
const login = loginmodel.getLoginUserInstance();

const registermodel = require('../../models/register/registerModel');
const registerCustomer =registermodel.getAuthCustomerInstance();

const authToken = require('../AuthenticationToken/authToken').getAuthServicesInstance();

module.exports.signup_get = (req,res) => {
    console.log(req.body)
    res.render("customer/register.ejs")

}

module.exports.signup_post = (req,res) => {
    var username = req.body.email;
    var password = req.body.password;
    var confirmpassword= req.body.confirmpassword;
    var name = req.body.name;
    var address = req.body.address;
    var phone = req.body.phonenumber;
    var customerType = req.body.CustomerType;

    console.log(req.body);
    console.log(confirmpassword===password)
    if(!(confirmpassword===password)){
        return res.status(400).json({message: "Reconfirm your password"});
           
    }

      
    login.getUser(username,connection)
    .then(results=> { 
        console.log("hello") 
        //check-if a customer 
        if(results.length>0){
            console.log("email already exits");
            return res.status(400).json({message: "Email Already Exist."});
           
        }
        else{
            bcrypt
            .genSalt(10)
            .then(salt => {
              //console.log('Salt: ', salt)
              return bcrypt.hash(password, salt)
            })
            .then(hash => {
              console.log('Hash: ', hash)
                registerCustomer.register(username,hash,connection)
                .then(results=>{
                    console.log("register done")
                    

                })
                .catch(error=>{console.log(error+"err")})
                
               
                registerCustomer.registerCustomerDetails(name,address,phone,username,customerType,connection)
                .then(results=>{
                    console.log("customer details registration done")
                    

                })
                .catch(error=>{console.log(error+"err")})
                })
                
            .catch(err => console.error(err.message))
          
            


        }
    })
    .catch(error=>{console.log(error+"err")})
    res.redirect('/')

   
}
