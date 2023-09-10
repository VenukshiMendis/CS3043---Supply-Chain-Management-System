const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();

router.get('/',function(req,res){
    var query = "select route_name  from route;"

	connection.query(query, function(error, data){
        console.log(data);

    if(!error){
        res.render("customer/confirmOrder.ejs",{title:'Order Confirmation', action:'list', sampleData:data});
    }
    })
 })

router.post('/',function(req,res){
    
    console.log(req.body.Confirmedornot);
    
    const decodeToken =authToken.decodeToken(req);
    console.log(decodeToken.username);
    console.log("here",req.body)
    connection.query(" call add_new_order1(?,?,?,?) ",[decodeToken.username,req.body.RouteName,req.body.DeliveryAddress,req.body.Confirmedornot],function(error,results,fields){
        if (error) {
            console.log(error);
        }
        else{
            console.log(results+"new order inserted")
            
        }
    });
    res.render("customer/customermain.ejs")
 })



 module.exports = router;

 //check if there are no items are in the cart brfore creating a new order