const express = require('express');
const connection = require('../../connection');
const router = express.Router();

router.post('/',function(req,res){
    
    var productName = req.body.product_name;
    var unitPrice = req.body.unit_price;
    var unitCapacity = req.body.unit_capacity;
    var stockAmount = req.body.stock_amount;
    var lastRefilledDate = req.body.last_refilled_date;
    var availabilityStatus = req.body.availability_status;
    

    query = "insert into product(product_ID,product_name,unit_price,unit_capacity,stock_amount,last_refilled_date,availability_status) values(?,?,?,?,?,?,?) ";
    connection.query(query,[13,productName,unitPrice,unitCapacity,stockAmount,lastRefilledDate,availabilityStatus],(err,results)=>{
        if(!err){
                res.render("manager/addSucceed.ejs")          
        }

        else{
            return res.status(500).json(err);
        }
    })

});


module.exports = router;
