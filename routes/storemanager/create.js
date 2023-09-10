const express = require('express');
const connection = require('../../connection');
const router = express.Router();
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();
const JWT = require('jsonwebtoken');

var store_id;
var driver_id = null;
var driver_assistant_id = null;

router.post('/',function(req,res){
    
    const decodeToken =authToken.decodeToken(req);
    console.log(decodeToken.username);
    connection.query(" SELECT store_ID FROM store_manager where email = (?) ",[decodeToken.username],function(error,results,fields){
        if (error) {
            console.log(error);
        }
        else{
            store_id = results[0].store_ID;
            console.log(store_id);
    
            connection.query("call get_drivers(?,?,?) ",[store_id,req.body.route_ID,req.body.turn_start_time],function(error,results,fields){
                if (error) {
                    console.log(error);          
                }
                else{
                    console.log(results[0][0]);
                    try {
                        driver_id = results[0][0].employee_ID;
                    } catch (error) {
                        console.log("No Drivers Available");
                    }
                    connection.query("call get_driver_assistants(?,?,?) ",[store_id,req.body.route_ID,req.body.turn_start_time],function(error,results,fields){
                        if (error) {
                            console.log(error);
                        }
                        else{
                            console.log(results[0][0]);
                            try {
                                driver_assistant_id = results[0][0].employee_ID;
                            } catch (error) {
                                console.log("No Driver Assistants Available");
                            }

                            if (driver_id != null && driver_assistant_id != null){
                                
                                connection.query("call assign_driver_and_driver_assistant(?,?,?,?,?,?) ",[store_id,req.body.route_ID,req.body.turn_start_time,req.body.vehicle_no,driver_assistant_id,driver_id],function(error,results,fields){
                                    if (error) {
                                        console.log(error);
                                    }
                                    else{
                                        console.log(results);
                                        console.log("Turn Creation Successful");
                                        res.render("storemanager/createSucceed.ejs")
                                    }
                                });
                            }
                            else{
                                    console.log("Turn Creation Failed");
                                    res.send("Turn Creation Failed");
                            }
                        }
                    });
                }
            
            });
        }
    });            
});

module.exports = router;