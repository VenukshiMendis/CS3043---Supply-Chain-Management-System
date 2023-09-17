// edited by HP
const express = require('express');

const router = express.Router();

const connection = require('../../connection');

router.get('/',function(req,res){
        res.render("reports/ReportDashboard.ejs");
}
);





module.exports = router;