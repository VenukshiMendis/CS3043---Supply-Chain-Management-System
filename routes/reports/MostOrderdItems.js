// edited by HP
const express = require('express');

const router = express.Router();

const connection = require('../../connection');

router.get('/',function(req,res){
    connection.query("call get_most_ordered_items()", function(error, data){
        console.log(data);
    if(!error){
                res.render("reports/MostOrderdItems.ejs",{title:'MOST ORDERED ITEMS', action:'list', sampleData:data[0]});
            }
            else{
                console.log("error is " + error);
            }
    
        }
    )
    }

);


module.exports = router;