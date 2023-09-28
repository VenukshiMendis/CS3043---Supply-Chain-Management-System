const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();
const JWT = require('jsonwebtoken')

router.get('/',function(req,res){
    
    console.log(req.cookies.token )
var query = "SELECT * FROM driver LEFT JOIN driver_roster ON driver.employee_ID = driver_roster.employee_ID ORDER BY driver.employee_ID";

connection.query(query, function(error, data){
  

if(!error){
    res.render("manager/driverDetails.ejs",{title:'Driver Details', action:'list', sampleData:data});
}
})
})

 

module.exports = router;



