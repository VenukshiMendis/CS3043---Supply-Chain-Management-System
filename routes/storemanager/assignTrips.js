const express = require('express');

const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();
const JWT = require('jsonwebtoken')
var store_id;

router.get('/',function(req,res){
    
    const decodeToken =authToken.decodeToken(req);
    console.log(decodeToken.username);
    connection.query(" SELECT store_ID FROM store_manager where email = (?) ",[decodeToken.username],function(error,results,fields){
        if (error) {
            console.log(error);
        }
        else{
            store_id = results[0].store_ID;
            var query = "SELECT * FROM order_info LEFT JOIN route_details ON order_info.route_ID = route_details.route_ID WHERE status = 'Delivered to store' AND store_ID = ? ORDER BY order_date";
    
            connection.query(query, [store_id], function(error, data){
                if(!error){
                    res.render("storemanager/assignTrips.ejs",{title:'List of orders to assign trips', action:'list', sampleData:data});
                }
            });
        }
    })            
});

module.exports = router;



