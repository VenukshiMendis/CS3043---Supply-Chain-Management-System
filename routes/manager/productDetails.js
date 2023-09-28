const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();
const JWT = require('jsonwebtoken')

router.get('/',function(req,res){
    
    console.log(req.cookies.token )
    var query = "SELECT * FROM product";

    connection.query(query, function(error, data){
    

    if(!error){
        res.render("manager/productDetails.ejs",{title:'Product Details', action:'list', sampleData:data});
    }
    })
})


module.exports = router;
