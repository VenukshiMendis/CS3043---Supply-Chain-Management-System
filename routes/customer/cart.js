const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();
const JWT = require('jsonwebtoken')

router.get('/',function(req,res){
    
        console.log(req.cookies.token )
    var query = "SELECT * FROM product where availability_status=1 ORDER BY product_ID";
    
	connection.query(query, function(error, data){
       //console.log(data);

    if(!error){
        res.render("customer/cart.ejs",{title:'List of products', action:'list', sampleData:data});
    }
    })
 })

 router.post('/add',function(req,res){
    const decodeToken =authToken.decodeToken(req);
    console.log(decodeToken.username);
    console.log("quantity "+req.body.quantity);
    console.log("here"+req.body.productID);
    //call procedure
    connection.query(" call add_products_to_the_cart(?,?,?) ",[decodeToken.username,req.body.productID,req.body.quantity],function(error,results,fields){
        if (error) {
            console.log(error);
        }
        else{
            console.log(results+"new row inserted")
            
        }
    });
    res.redirect("/cart")

 })

 router.post('/remove',function(req,res){
    const decodeToken =authToken.decodeToken(req);
    console.log(decodeToken.username);
    console.log("quantity "+req.body.quantity);
    console.log("here"+req.body.productID);
        connection.query(" call remove_product_from_cart(?,?) ",[decodeToken.username,req.body.productID],function(error,results,fields){
        if (error) {
            console.log(error);
        }
        else{
            console.log(results+"row removed")
            console.log(results) ;
            res.redirect('/getOrder');
        }
    });

 })


module.exports = router;



