// edited by HP
const express = require('express');

const router = express.Router();

const connection = require('../../connection');






    router.get('/',function(req,res){
        connection.query("call get_city_report()", function(error, cdata){
            console.log(cdata[0]);
        if(!error){
            if(!error){
                connection.query("call get_route_report()", function(error, rdata){
                    console.log(rdata[0]);
                if(!error){
                    console.log("no error");
                    res.render("reports/SalesReportByCityRoute.ejs",{title:'SALES REPORT BY CITY AND ROUTE', action:'list',sampleData:cdata[0], sampleData2:rdata[0]});
                }
                else{
                    console.log("error is " + error);
                }

        
            }
        )
        }
        else{
            console.log("error is " + error);
        }
    }
    }
    )
    }
    );
module.exports = router;