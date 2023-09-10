const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();

router.get('/',function(req,res){
    const decodeToken =authToken.decodeToken(req);
    console.log("order history here")
    connection.query("call get_order_history(?)", [decodeToken.username],function(error, data){
    console.log(data[0]);

    if(!error){
        console.log("here");
        res.render("customer/orderhistory.ejs",{title:'Order History', action:'list', sampleData:data[0]});
    }
    })
 })



 router.post('/orderHistoryProducts',function(req,res){
    const decodeToken =authToken.decodeToken(req);
    console.log(req.body.order_ID)
    connection.query("select order_details.product_ID,product_name,unit_price,quantity,unit_price*quantity as total from order_details join product using(product_ID) where order_ID =? ", [req.body.order_ID],function(error, data){
    console.log(data);

    if(!error){
        connection.query("select total_price as total from order_info where  order_ID=? ", [req.body.order_ID],function(error, total){ 
            console.log(total);
            console.log("here");
            res.render("customer/orderHistory_Products.ejs",{title:'Products', action:'list', sampleData:data, total:total});
            
        })

        
    }
    })
 })



 module.exports = router;
