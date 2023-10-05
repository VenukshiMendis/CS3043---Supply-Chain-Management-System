
const express = require('express');
const router = express.Router();
const driverController = require('../../controllers/driver/driverController');


//create,find,update,delete functions
router.get('/', driverController.view);
//router.get('/showOrders/:id', driverController.show);
router.post('/showOrders', driverController.show);

router.post('/setStatus', driverController.setOrdStatus);

router.post('/startTrip', driverController.startTrip);

router.post('/endTrip', driverController.endTrip);

router.post('/viewCompleted', driverController.viewCompleted);

module.exports = router;