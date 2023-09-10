const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/createTurn',(req,res)=>{
    res.render("storemanager/createTurn.ejs")
});

module.exports = router;