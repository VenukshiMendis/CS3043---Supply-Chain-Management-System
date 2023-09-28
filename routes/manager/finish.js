const express = require('express');
const connection = require('../../connection');
const router = express.Router();

router.post('/',function(req,res){
    console.log(req.data);
    
    var orderID = req.body.order_ID;
    var trainName = req.body.train_name;
    
   
    connection.query("call assign_order_to_train(?,?)",[orderID,trainName],(err,results)=>{
        if(!err){
           
            res.render("manager/assignSucceed.ejs");
                     
        }

        else{
            console.log(err)
            
        }
    })

});


module.exports = router;