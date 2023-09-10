const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();

router.get('/',function(req,res){
    const decodeToken =authToken.decodeToken(req);
   // connection.query("select cart.product_ID,product_name,unit_price,quantity,total from cart join product using(product_ID) where (customer_email ) in(?)", [[[decodeToken.username]]],function(error, data){
    connection.query("select cart.product_ID,product_name,unit_price,quantity from cart join product using(product_ID) where  (customer_email ) in(?)", [[[decodeToken.username]]],function(error, data){ 
   
   console.log(data);

    if(!error){
        connection.query("select sum(cart.quantity*unit_price) as total from cart join product using(product_ID) where  (customer_email ) in(?)", [[[decodeToken.username]]],function(error, total){ 
            console.log(total);
            if(!error){
                res.render('customer/order.ejs',{title:'Shopping Cart', action:'list' ,sampleData:data, total:total});
                
            }
        })
        
    }
    })
 })

 module.exports = router;

 