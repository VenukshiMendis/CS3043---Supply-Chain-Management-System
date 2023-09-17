// edited by HP
const express = require('express');

const router = express.Router();

const connection = require('../../connection');

router.get('/',function(req,res){
    
    var query= "call get_customer_order_report()";
    console.log(query);
    connection.query(query, function(error, data){
        console.log("data is fetching");
        console.log(data[0]);
    if(!error){
                res.render("reports/CustomerOrderReport.ejs",{title:'CUSTOMER ORDER REPORT', action:'list', sampleData:data[0]});
            }
            else{
                console.log("error is " + error);
            }
    
        }
    )
    }

);

module.exports = router;