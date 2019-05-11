'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../controllers/userController')

// /user/login => POST
router.post('/login', userController.loginUser);

// /user/singup => POST
router.post('/signup', userController.signupUser);

router.post('/logout', userController.logoutUser);

module.exports = router;