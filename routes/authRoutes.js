const express = require('express'); // Using express
const { RegisterUser, LoginUser, VerifyEmailToken } = require('../controllers/authController');

// Express Router Initializing
const authRouter = express.Router();

// Auth Router Endpoints
authRouter.post('/sign-up', RegisterUser) // Register user
authRouter.post('/sign-in', LoginUser) // Log user
authRouter.post('/verify-email/:emailToken', VerifyEmailToken)


// Export Auth Routers
module.exports = authRouter;