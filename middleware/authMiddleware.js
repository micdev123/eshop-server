const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// const User = require('../models/User');

// Generate Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
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
    const getAccessToken = req?.headers?.authorization?.startsWith("Bearer");
    // Check accessToken
    if (getAccessToken) {
        // Get the token and Set it to the token variable
        token = getAccessToken.split(" ")[1];
        // Using try catch block to minimize error
        try {
            // Check if token
            if (token) {
                // calling the verify method to decode the token
                const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

                // Take the decoded token and find that user with that token
                const userVerified = await User.find(theUser => theUser.id === decodeToken?.id);
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



// Export the following middleware modules
module.exports = {
    generateToken,
    verifyToken,
}