const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();
const JWT = require('jsonwebtoken')

router.get('/',function(req,res){
    
    console.log(req.cookies.token )
    const decodeToken =authToken.decodeToken(req);
    console.log(decodeToken.username);
    connection.query(" SELECT store_ID FROM store_manager where email = (?) ",[decodeToken.username],function(error,results,fields){
        if (error) {
            console.log(error);
        }
        else{
            store_id = results[0].store_ID;
            var query = "SELECT * FROM truck WHERE store_ID = ? ORDER BY vehicle_no";

            connection.query(query, [store_id], function(error, data){
                if(!error){
                    res.render("storemanager/showTruckDetails.ejs",{title:'Driver Assistant Details', action:'list', sampleData:data});
                }
            })
        }
    })
});

module.exports = router;



