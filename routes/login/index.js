const express = require('express');
const router = express.Router();

const authController = require('../../controllers/login/loginAuthorization');

//get login page
router.get('/',authController.login_get)

//login
router.post('/', authController.login_post)

// logout 
//router.get('/logout', authController.logout_get)



 //exports the router
 module.exports = router;


 



