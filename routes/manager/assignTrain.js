const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();
const JWT = require('jsonwebtoken')

router.get('/',function(req,res){
    
        console.log(req.cookies.token )
    var query = "SELECT * FROM order_info WHERE status = 'Order Placed' ORDER BY order_date";
    
	connection.query(query, function(error, data){
      

    if(!error){
        res.render("manager/assignTrain.ejs",{title:'List of orders to assign trains', action:'list', sampleData:data});
    }
    })
 })

 
 
 
module.exports = router;