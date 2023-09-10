const express = require('express');
const router = express.Router();

const authController = require('../../controllers/register/registerauthorization');

//get login page
router.get('/',authController.signup_get)

//login
router.post('/signup', authController.signup_post)


 //exports the router
 module.exports = router;
