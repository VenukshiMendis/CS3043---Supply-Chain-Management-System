const mysql =require('mysql');
require('dotenv').config();
const express = require('express');
const connection = require('./connection');
//const userRoute = require('./routes/user');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const encoder = bodyParser.urlencoded();

const app= express()

//parse url-encoded bodies as sent by HTML forms
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.use(cookieParser());


app.use("/assets",express.static("assets"));

//get the route of index.js file
const index = require('./routes/login/index')
const register = require('./routes/register/register')
const products = require('./routes/customer/cart')
const order = require('./routes/customer/order')
const confirmOrder = require('./routes/customer/confirmOrder')
const orderHistory = require('./routes/customer/viewOrderHistory')
const unconfirmedOrders= require('./routes/customer/UnconfirmedOrders')
const {cookieJwtAuth} = require('./Middleware/cookieJWTAuth')

const driver_routes = require('./routes/driver/drivermain');
const driverAssistant_routes = require('./routes/driverAssistant/driverAssistantmain');

const trips = require('./routes/storemanager/assignTrips')
const assign = require('./routes/storemanager/assign')
const truck_assign = require('./routes/storemanager/truckAssignment')
const create = require('./routes/storemanager/create')
const truck_details = require('./routes/storemanager/showTruckDetails')
const driver_details = require('./routes/storemanager/showDriverDetails')
const driver_assistant_details = require('./routes/storemanager/showDriverAssistantDetails')
const train = require('./routes/manager/assignTrain')
const driver_Details = require('./routes/manager/driverDetails')
const driver_assistant_Details = require('./routes/manager/driverAssistantDetails')
const store_manager_Details = require('./routes/manager/storeManagerDetails')
const train_details = require('./routes/manager/trainDetails')
const product_details = require('./routes/manager/productDetails')
const show_trip = require('./routes/manager/showTrip')
const create1 = require('./routes/manager/create1')
const add = require('./routes/manager/add')
const finish = require('./routes/manager/finish')

const ReportDashboard = require('./routes/reports/ReportDashboard')  
const MostOrderdItems = require("./routes/reports/MostOrderdItems")  
const CustomerOrderReport = require('./routes/reports/CustomerOrderReport')  
const QuarterlySalesReport = require('./routes/reports/QuarterlySalesReport') 
const DriverWorkinghoursReport = require('./routes/reports/DriverWorkinghoursReport')  
const DriverAssistantWorkinghoursReport = require('./routes/reports/DriverAssistantWorkinghoursReport')  
const SalesReportByCityRoute = require('./routes/reports/SalesReportByCityRoute')  
const TruckUsedhoursReport = require('./routes/reports/TruckUsedhoursReport')
//const create_turn = require('./routes/storemanager/createTurn')

//use the index.js file in login
app.use('/',index);
app.use('/register',register);
app.use('/cart',cookieJwtAuth,products);
app.use('/getorder',order);
app.use('/confirmOrder',confirmOrder);
app.use('/orderHistory',orderHistory);
app.use('/unconfirmedOrders',unconfirmedOrders);

app.use('/drivermain', driver_routes);
app.use('/driverAssistantmain', driverAssistant_routes);

app.use('/assignTrips',trips);
app.use('/assign',assign);
app.use('/truckAssignment',truck_assign);
app.use('/create',create);
app.use('/showTruckDetails',truck_details);
app.use('/showDriverDetails',driver_details);
app.use('/showDriverAssistantDetails',driver_assistant_details);
app.use('/assignTrain',train);
app.use('/driverDetails',driver_Details);
app.use('/driverAssistantDetails',driver_assistant_Details);
app.use('/storeManagerDetails',store_manager_Details);
app.use('/trainDetails',train_details);
app.use('/productDetails',product_details);
app.use('/showTrip',show_trip);
app.use('/create1',create1);
app.use('/add',add);
app.use('/finish',finish);
//app.use('/createTurn',create_turn)

app.get('/createTurn',(req,res)=>{
    res.render("storemanager/createTurn.ejs")
 })
 
 app.get('/assignSucceed',(req,res)=>{
    res.render("storemanager/assignSucceed.ejs")
 })
 app.get('/managermain',(req,res)=>{
   res.render("manager/managermain.ejs")
})
app.get('/employee',(req,res)=>{
   res.render("manager/employee.ejs")
})

app.get('/assignTrain',(req,res)=>{
   res.render("manager/assignTrain.ejs")
})
app.get('/createTrip',(req,res)=>{
   res.render("manager/createTrip.ejs")
})

app.get('/addProduct',(req,res)=>{
   res.render("manager/addProduct.ejs")
})
app.get('/select',(req,res)=>{
   res.render("manager/select.ejs")
})



//REPORTS
app.use('/MostOrderdItems',MostOrderdItems); 
app.use('/CustomerOrderReport',CustomerOrderReport); 
app.use('/ReportsDashboard',ReportDashboard); 
app.use('/QuarterlySalesReport',QuarterlySalesReport); 
app.use('/DriverWorkinghoursReport',DriverWorkinghoursReport); 
app.use('/DriverAssistantWorkinghoursReport',DriverAssistantWorkinghoursReport); 
app.use('/SalesReportByCityRoute',SalesReportByCityRoute); 
app.use('/TruckUsedhoursReport',TruckUsedhoursReport);



app.listen(4001)
