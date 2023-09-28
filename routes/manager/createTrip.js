const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/createTrip',(req,res)=>{
    res.render("manager/createTrip.ejs")
 })

 
router.get('/',function(req,res){
    
    var trainName = req.body.train_name;
    var sheduleDate = req.body.shedule_date;
    

    console.log(req.body);

    query = "call add_train_trip(?,?) ";
    connection.query(query,[trainName,sheduleDate],(err,results)=>{
        if(!err){
            return res.status(200).json({message:" Successfully Created "});
        }

        else{
            return res.status(500).json(err);
        }
    })

}) 

module.exports = router; 