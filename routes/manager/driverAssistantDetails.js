const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();
const JWT = require('jsonwebtoken')

router.get('/',function(req,res){
    
    console.log(req.cookies.token )
    var query = "SELECT * FROM driver_assistant LEFT JOIN driver_assistant_roster ON driver_assistant.employee_ID = driver_assistant_roster.employee_ID ORDER BY driver_assistant.employee_ID";

    connection.query(query, function(error, data){
    

    if(!error){
        res.render("manager/driverAssistantDetails.ejs",{title:'Driver Assistant Details', action:'list', sampleData:data});
    }
    })
})

 
module.exports = router;



