const mysql = require('mysql');
const { createTestAccount } = require('nodemailer');

const authToken = require('../../controllers/AuthenticationToken/authToken').getAuthServicesInstance();

//require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 100,
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
});

//connect to DB
 
//View Upcoming Trips
exports.view = (req, res) => {


    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log('Connected as ID' + connection.threadId);
        const decodeToken =authToken.decodeToken(req);
        console.log(decodeToken.username);

        connection.query(" call get_upcoming_trips_d(?)",[decodeToken.username],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                console.log(data[0]);
                res.render("driver/upcomingTrips.ejs", {title:'List of upcoming trips', action:'list', sampleData:data[0]});
            } else {
                console.log(err);
            }

            
        });

    });
}


//view Orders
exports.show = (req, res) => {
    
    console.log(req.body.turnID);  //////////////
    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log('Connected as ID' + connection.threadId);

        var query ="SELECT truck_turn_ID,order_ID, name, phone, address, status FROM turn_order_info where truck_turn_id = ? ;"  //turn_order_info is a view

        connection.query(query,[req.body.turnID],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                res.render("driver/showOrders.ejs", {title:'List of relevant orders', action:'list', sampleData:data});
            } else {
                console.log(err);
            }

            console.log(data);
        });
    });
}



//Update Order Status
exports.setOrdStatus = (req, res) => {
    
    console.log(req.body.orderID);  //////////////
    
    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log('Connected as ID' + connection.threadId);        
        //var query ="UPDATE order_info SET status = 'Assigned to truck' WHERE order_ID = ?; //procedure needs to be changed to "Delivered" 

        connection.query("call set_order_status(?)",[req.body.orderID],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                console.log(data);
                res.render("driver/showOrders.ejs", {title:'List of relevant orders', action:'list', sampleData:data[0], message:req.body.orderID});               
            } else {
                console.log(err);
            }            
        });
    });
}



//Record time at the start of trip
exports.startTrip = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log('Connected as ID' + connection.threadId);

        connection.query("call set_actual_start_time(?)",[req.body.turnID],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                console.log(data);             
            } else {
                console.log(err);
            }            
        });
    });
}


//Record (server) time at the end of trip
exports.endTrip = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log('Connected as ID' + connection.threadId);

        connection.query("call set_actual_end_time(?)",[req.body.turnID],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                console.log(data);             
            } else {
                console.log(err);
            }            
        });
    });
}



//View Completed Trips
exports.viewCompleted = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log('Connected as ID' + connection.threadId);
        const decodeToken =authToken.decodeToken(req);

        connection.query(" call get_completed_trips_d(?)",[decodeToken.username],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                console.log(data[0]);
                res.render("driver/completedTrips.ejs", {title:'List of Completed trips', action:'list', sampleData:data[0]});
            } else {
                console.log(err);
            }

            
        });

    });
}
