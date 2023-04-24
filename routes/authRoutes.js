const express = require('express'); // Using express
const { RegisterUser, LoginUser } = require('../controllers/authController');

// Express Router Initializing
const authRouter = express.Router();

// Auth Router Endpoints
authRouter.post('/sign-up', RegisterUser) // Register user
authRouter.post('/sign-in', LoginUser) // Log user


// Export Auth Routers
module.exports = authRouter;