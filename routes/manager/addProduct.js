const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/addProduct',(req,res)=>{
    res.render("manager/addProduct.ejs")
 })

router.get('/',function(req,res){
    
    var productName = req.body.product_name;
    var unitPrice = req.body.unit_price;
    var unitCapacity = req.body.unit_capacity;
    var stockAmount = req.body.stock_amount;
    var lastRefilledDate = req.body.last_refilled_date;
    var availabilityStatus = req.body.availability_status;
    

    console.log(req.body);

    query = "insert into product(product_ID,product_name,unit_price,unit_capacity,stock_amount,last_refilled_date,availability_status) values(?,?,?,?,?,?,?) ";
    connection.query(query,[13,productName,unitPrice,unitCapacity,stockAmount,lastRefilledDate,availabilityStatus],(err,results)=>{
        if(!err){
            return res.status(200).json({message:" Successfully Added "});
        }

        else{
            return res.status(500).json(err);
        }
    })

})

module.exports = router;