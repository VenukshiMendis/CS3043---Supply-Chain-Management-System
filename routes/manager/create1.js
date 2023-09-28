const express = require('express');
const connection = require('../../connection');
const router = express.Router();

router.post('/',function(req,res){
    
    var trainName = req.body.train_name;
    var sheduleDate = req.body.shedule_date;
    

    query = "call add_train_trip(?,?) ";
    connection.query(query,[trainName,sheduleDate],(err,results)=>{
        if(!err){
                res.render("manager/tripCreateSucceeds.ejs")          
        }

        else{
            return res.status(500).json(err);
        }
    })

});


module.exports = router;