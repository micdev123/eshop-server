const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const createError = require('http-errors');

// Generate Token
const generateToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

// Verify Token
const verifyToken = asyncHandler(async (req, res, next) => {
    let token;
    // Get accessToken from request header
    const authHeader = req?.headers?.authorization?.startsWith("Bearer");
    // Check accessToken
    if (authHeader) {
        // Get the token and Set it to the token variable
        token = authHeader.split(" ")[1];
        // Using try catch block to minimize error
        try {
            // Check if token
            if (token) {
                // calling the verify method to decode the token
                const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

                // Take the decoded token and find that user with that token
                const userVerified = await User.find(theUser => theUser.email === decodeToken?.email);
                // Set the request.user to the verified user
                req.user = userVerified;
                // Calling the next() fnx
                next();
            }
            
        } catch (error) {
            res.status(401).json({message: "Unauthorized, Please Login again!"})
        }
    }
    else {
        throw new Error(" There is no token attached to header");
    }
})

// Google Authentication

// Instantiating a new auth client object
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);


const verifyGoogleAuthToken = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req?.headers?.authorization;
        // console.log(authHeader);
        if (!authHeader) {
            next(createError.Unauthorized())
        }
        const token = authHeader.split(" ")[1];
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (payload) {
            req.user = payload['sub'];
            next()
            return
        }
        next(createError.Unauthorized())
    } catch (error) {
        next(err);
    }
})



// Export the following middleware modules
module.exports = {
    generateToken,
    verifyToken,
    verifyGoogleAuthToken
}