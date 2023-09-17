// edited by HP
const express = require('express');

const router = express.Router();

const connection = require('../../connection');




router.post('/',function(req,res){
     
    var query= "cALL get_quarterly_sales_report(?)".replace("?",req.body.year);
    console.log(query);
    connection.query(query, function(error, data){
        console.log("data is fetching");
        console.log(data[0]);
    if(!error){
                res.render("reports/QuarterlySalesReport.ejs",{title:'', action:'list', sampleData:data[0]});
            }
            else{
                console.log("error is " + error);
            }
        }
    )
    } 
);

    




module.exports = router;






