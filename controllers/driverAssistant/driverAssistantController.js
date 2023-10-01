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
 
//View Users
exports.view = (req, res) => {


    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log('Connected as ID' + connection.threadId);
        const decodeToken =authToken.decodeToken(req);
        console.log(decodeToken.username);

        //how to connect of the current date, or week and completed = FALSE (update table)
        //var query = "SELECT * FROM turn WHERE driver_ID = ? AND  date >= 2023-01-15 ORDER BY date;"; //where completed = false
        //have to show, route name, driver asst name
        
        connection.query(" call get_upcoming_trips_da(?)",[decodeToken.username],(err,data) => {
        //connection.query(query,[5],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                console.log(data);//data[1] if procedure called 
                res.render("driverAssistant/upcomingTripsDA.ejs", {title:'List of Upcoming Trips', action:'list', sampleData:data[0]}); //change to data[0] if procedure is called
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

        var query ="SELECT truck_turn_ID,order_ID, name, phone, address, status FROM turn_order_info where truck_turn_id = ? ;"  

        connection.query(query,[req.body.turnID],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                res.render("driverAssistant/showOrdersDA.ejs", {title:'List of Relevant Orders', action:'list', sampleData:data});
            } else {
                console.log(err);
            }

            console.log(data);
        });
    });
}



//Update Order Status
exports.setOrdStatus = (req, res) => {
    
    
    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log('Connected as ID' + connection.threadId);
        
        //var query ="UPDATE order_info SET status = 'Assigned to truck' WHERE order_ID = ?; //procedure needs to be changed to "Delivered" 

        connection.query("call set_order_status(?)",[req.body.orderID],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                console.log(data);
                res.render("driver/showOrdersDA.ejs", {title:'List of Relevant Orders', action:'list', sampleData:data[0], message:req.body.orderID});               
            } else {
                console.log(err);
            }            
        });
    });
}


/*
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
    
    console.log(req.body.turnID);  //////////////

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
*/

//View Completed Trips
exports.viewCompleted = (req, res) => {


    pool.getConnection((err, connection) => {
        if (err) throw err; 
        console.log('Connected as ID' + connection.threadId);
        const decodeToken =authToken.decodeToken(req);

        connection.query(" call get_completed_trips_da(?)",[decodeToken.username],(err,data) => {
            //when done with connection 
            connection.release();

            if(!err) {
                console.log(data[0]);
                res.render("driverAssistant/completedTripsDA.ejs", {title:'List of Completed trips', action:'list', sampleData:data[0]});
            } else {
                console.log(err);
            }

            
        });

    });
}