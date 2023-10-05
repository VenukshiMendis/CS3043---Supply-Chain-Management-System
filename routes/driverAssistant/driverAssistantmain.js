
const express = require('express');
const router = express.Router();
const driverAssistantController = require('../../controllers/driverAssistant/driverAssistantController');


//create,find,update,delete functions
router.get('/', driverAssistantController.view);

router.post('/showOrders', driverAssistantController.show);

router.post('/setStatus', driverAssistantController.setOrdStatus);

//router.post('/startTrip', driverAssistantController.startTrip);

//router.post('/endTrip', driverAssistantController.endTrip);

router.post('/viewCompleted', driverAssistantController.viewCompleted);

module.exports = router;