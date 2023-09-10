const express = require('express');
const router = express.Router();

const connection = require('../../connection');
const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();
const JWT = require('jsonwebtoken')
var truckTurnID;

router.post('/',function(req,res){
    const decodeToken =authToken.decodeToken(req);
    console.log(decodeToken.username);
    console.log("Order ID "+req.body.OrderID);
    console.log("Route ID "+req.body.RouteID);

    //var query = "SELECT * FROM loginsystem.turn WHERE route_ID = ? and datediff(turn_start_time, '2023-01-10 12:00:00') < 7";

    //connection.query(query, [req.body.RouteID], function(error, data){
    connection.query(" SELECT * FROM turn WHERE route_ID = ? and datediff(turn_start_time, '2023-01-07 15:08:31') < 7",[req.body.RouteID],function(error,data){
        truckTurnID = data[0].truck_turn_ID;
        if (error) {
            console.log(error);
        }
        else{
            connection.query(" insert into truck_assignment(order_ID,truck_turn_ID)  values ? ",[[[req.body.OrderID,truckTurnID]]],function(error,results,fields){
                if (error) {
                    console.log(error);
                    res.send("Truck Assignmet Failed");
                }
                else{
                    connection.query("UPDATE order_info SET status = 'Assigned to truck' WHERE order_ID = ?", [req.body.OrderID], function(error, data){
                    });
                }
            });
            res.render("storemanager/truckAssignSucceed.ejs")
        }
    });

 });  

 module.exports = router;