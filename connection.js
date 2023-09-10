const mysql =require('mysql');
require('dotenv').config();

var conncetion =mysql.createConnection({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,

});

conncetion.connect((err)=>{
    if(!err){
        console.log("Connected to database");
    }
    else{
        console.log("Error while connecting to the database"+err);
    }
});

module.exports=conncetion;