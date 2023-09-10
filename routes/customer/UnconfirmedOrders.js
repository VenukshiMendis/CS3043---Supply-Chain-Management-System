const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();

router.get('/',function(req,res){
    const decodeToken =authToken.decodeToken(req);
    console.log("order history here")
    connection.query("call get_unconfirmed_order_history(?)", [decodeToken.username],function(error, data){
    console.log(data);

    if(!error){
        console.log("here");
        res.render("customer/unconfirmedOrders.ejs",{title:'Unconfirmed Orders', action:'list', sampleData:data[0]});
    }
    })
 })

 router.post('/unconfirmedorderHistoryProducts',function(req,res){
    const decodeToken =authToken.decodeToken(req);
    console.log(req.body)
    connection.query("select order_details.product_ID,product_name,unit_price,quantity,unit_price*quantity as total from order_details join product using(product_ID) where order_ID =? ", [req.body.order_ID],function(error, data){
    console.log(data);

    if(!error){
        connection.query("select total_price as total from order_info where  order_ID=? ", [req.body.order_ID],function(error, total){ 
            console.log(total);
            console.log("here");
            res.render("customer/unconfirmed_order_products.ejs",{title:'Products', action:'list', sampleData:data, total:total , orderID:req.body.order_ID});
            
        })

        
    }
    })
 })

 router.post('/confirm',function(req,res){
    const decodeToken =authToken.decodeToken(req);
    console.log(req.body,"here");
    connection.query("update order_info set status ='Confirmed' where order_ID =?", [req.body.orderID],function(error, data){
        console.log(data);
        if(!error){
            console.log("Successfully changed order status to Confirmed");
        }
    })
    res.redirect("/unconfirmedOrders")
    
 })




 module.exports = router;