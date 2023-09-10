const express = require('express');

const router = express.Router();

const connection = require('../connection');

router.get('/storemanagermain',function(req,res){
    res.render("storemanager/storemanagermain.ejs")
});

module.exports = router;