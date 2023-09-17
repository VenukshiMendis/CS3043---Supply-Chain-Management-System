// edited by HP
const express = require('express');

const router = express.Router();

const connection = require('../../connection');

router.get('/',function(req,res){
    
    var query= "call get_driver_assistant_details()";
    console.log(query);
    connection.query(query, function(error, data){
        console.log("data is fetching");
        console.log(data[0]);
    if(!error){
                res.render("reports/DriverAssistantWorkinghoursReport.ejs",{title:'DRIVER ASSISTANT WORKING HOURS REPORT', action:'list', sampleData:data[0]});
            }
            else{
                console.log("error is " + error);
            }
    
        }
    )
    }

);

module.exports = router;