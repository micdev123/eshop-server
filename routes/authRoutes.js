const express = require('express'); // Using express
const { RegisterUser, LoginUser, VerifyEmailToken, Logout, googleOAuth } = require('../controllers/authController');
const { verifyGoogleAuthToken } = require('../middleware/authMiddleware');


// Express Router Initializing
const authRouter = express.Router();

// Auth Router Endpoints
authRouter.post('/registerAuth', RegisterUser) // Register user
authRouter.post('/loginAuth', LoginUser) // Log user
authRouter.post('/verifyAccount/:emailToken', VerifyEmailToken); // Verify emailToken

// OAuthGoogle Authentication
authRouter.post('/googleAuth', verifyGoogleAuthToken,  googleOAuth);


// authRouter.get("/google",
//     passport.authenticate("google", { scope: ["profile", "email", "phone"] })
// )

// authRouter.get("/google/callback",
//     passport.authenticate("google", {
//         successRedirect: `${process.env.CLIENT_BASE_URL}`,
//         failureRedirect: "/failure"
//     })
// )


authRouter.get('/logout', Logout) // Logout user


// Export Auth Routers
module.exports = authRouter;