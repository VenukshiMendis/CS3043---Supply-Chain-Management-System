
const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/select',(req,res)=>{
    res.render("manager/select.ejs")
 })

 
router.get('/',function(req,res){
    var orderID = req.body.ID;
    var trainName = req.body.train;
    
    console.log(req.body);

    
    connection.query("call assign_order_to_train(?,?)",[orderID,trainName],(err,results)=>{
        if(!err){

            return res.status(200).json({message:" Successfully Assigned "});
        }

        else{
            console.log("#########")

           
        }
    })

})

module.exports = router;