const User = require('../models/User.js') // User Model
const asyncHandler = require('express-async-handler');
const { generateToken } = require("../middleware/authMiddleware.js");
const validator = require("validator");
// const { v4: uuidv4 } = require('uuid');
const { decodeJwt } = require('jose');

const createError = require('http-errors');
const { sendMagicLink } = require('../utils/mailer.js');

// Magic Link | Email Token Authentication
// Create | Register User Account
const RegisterUser = asyncHandler(async (req, res) => {
    // Get input data from req.body to check if email exist
    const { name, email, location } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email!" })
    }

    const alreadyExist = await User.findOne({ email }) // Check the email if already registered
    
    // If already registered
    if (alreadyExist) {
        return res.status(401).send({ message: "User Already Registered!" });
    }
    // Create the account
    const newUser = new User({
        name,
        email,
        location
    });

    // Using try catch to minimize error
    try {
        // Saving new user to database
        const saveNewUser = await newUser.save();
        const { ...others } = saveNewUser._doc; // 

        // send magic link to email
        const confirmation_link = `${process.env.CLIENT_BASE_URL}verifyAccount/${generateToken(saveNewUser).split('.').join(':@')}`

        await sendMagicLink(newUser, "Account Confirmation Link", confirmation_link);

        // Sending the following if status code == 200
        res.status(200).json({ ...others, accessToken: generateToken(saveNewUser) })
    }
    catch (error) {
        res.status(500).json(error)
    }

});



// Google OAuth 
const googleOAuth = asyncHandler(async (req, res) => {
    
    const payload = req.body;
    // console.log(payload);
    if (!payload) {
        next(createError.Unauthorized())
    }

    const { name, email, email_verified, picture, location } = payload;

    const userExists = await User.findOne({ email }) // Check the email if already registered
    
    // If already registered
    if (userExists) {
        const { ...others } = userExists._doc
        res.status(200).json({ ...others, accessToken: generateToken(userExists) });
    }
    else {
            try {
            // Create the account
            const newUser = new User({
                name,
                email,
                emailToken: 'null',
                emailVerified: email_verified,
                picture,
                location
            });

            // Saving new user to database
            const saveNewUser = await newUser.save();
            const { ...others } = saveNewUser._doc; // 

            // Sending the following if status code == 200
            res.status(201).json({ ...others, accessToken: generateToken(saveNewUser) })
        }
        catch (error) {
            res.status(500).json(error);
            console.log(error);
        }
    }

    // console.log(newUser);
    

});

// Login User
const LoginUser = asyncHandler(async(req, res) => {
    // Get input data from req.body
    const { email } = req.body;
    // Check if email field is empty
    if (!email) {
        return res.status(401).send({ message: "Field Required!" });
    }
    
    // Check email format
    if (!validator.isEmail(email)) {
        return res.status(401).send({ message: "Invalid email!" });
    }
    
    // If all above measures passed
    try {
        // Check if the email exist in database
        const findUser = await User.findOne({ email });
        
        if (findUser) {
            findUser.emailVerified = false;

            const updateUser = await findUser.save();
            const { ...others } = updateUser._doc; // 

            // send magic link to email
            const confirmation_link = `${process.env.CLIENT_BASE_URL}verifyAccount/${generateToken(updateUser).split('.').join(':@')}`

            await sendMagicLink(findUser, "Account Confirmation Link", confirmation_link);

            // Sending the following if status code == 200
            res.status(200).json({ ...others, accessToken: generateToken(updateUser) })
        }
        
        
    } catch (error) {
        res.status(500).json(error)
    }
})





// Verify Account with emailAuth | emailToken
const VerifyEmailToken = asyncHandler(async (req, res) => {
    try {
        //Get emailToken
        const emailToken = req.params.emailToken;
        
        // Check if emailToken exist
        if (!emailToken) {
            return res.status(400).json({ message: "EmailToken not found!" });
        }

        // Get email from decoded emailToken
        const { email } = emailToken ? decodeJwt(emailToken) : undefined;

        // If exist go ahead and find the user with that emailToken
        const user = await User.findOne({ email });
        if (user) {
            // Set emailVerified to true
            user.emailVerified = true 

            // The save the updated user to database
            const updateUser = await user.save(); 
            const { ...others } = updateUser._doc;

            // Return
            res.status(200).json({ ...others, accessToken: generateToken(updateUser) });
        }
        else {
            res.status(404).json({ message: "Invalid emailToken!" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error.message)
    }
})




const Logout = asyncHandler(async (req, res) => {
    req.logout({}, err => {
        if (err) return res.status(500).json({ message: "Logout Failed!" });
        res.redirect(`${process.env.CLIENT_BASE_URL}`)
    })
})


module.exports = {
    RegisterUser,
    LoginUser,
    VerifyEmailToken,
    Logout,
    googleOAuth
}