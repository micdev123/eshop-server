const User = require('../models/User.js') // User Model
const asyncHandler = require('express-async-handler');
const { generateToken } = require("../middleware/authMiddleware.js");
const validator = require("validator");
const { v4: uuidv4 } = require('uuid');
const { sendMagicLink } = require('./emailController')

// Create | Register User Account
const RegisterUser = asyncHandler(async (req, res) => {
    // Get input data from req.body to check if email exist
    const { fullName, email, mobile } = req.body;

    const alreadyRegistered = await User.findOne({ email: email }) // Check the email if already registered
    
    // If not registered
    if (!alreadyRegistered) {
        // Create the account
        const newUser = new User({
            fullName: fullName,
            email: email,
            mobile: mobile,
            magicLink: uuidv4()
        })
        // Using try catch to minimize error
        try {
            // Saving new user to database
            const saveNewUser = await newUser.save();
            const { ...others } = saveNewUser._doc;

            // send magic link to email
            let sendEmail = sendMagicLink(email, saveNewUser.magicLink, 'sign-up');

            // Sending the following if status code == 200
           res.status(200).json({ ...others, accessToken: generateToken(saveNewUser) })
        }
        catch (error) {
            res.status(500).json(error)
        }

    }
    else { // Throw an error with the message user already registered
        throw new Error("User Already Registered!");
    }
})

// Login User
const LoginUser = asyncHandler(async(req, res) => {
    // Get input data from req.body
    const { email, magicLink } = req.body;
    // Check if email field is empty
    if (!email) return res.json({ ok: false, message: "Field Required!" });
    
    // Check email format
    if (!validator.isEmail(email)) return res.json({ ok: false, message: "Check your email to finish logging-in" });
    
    // If all above measures passed
    try {
        // Check if the email exist in database
        const findUser = User.findOne({ email: email });
        // If the user is registered but magicLink is absent
        if (findUser &!magicLink) {
            const findUser = await User.findOneAndUpdate(
                { email: email },
                { magicLink: uuidv4(), magicLinkExpired: false },
                { returnDocument: 'after' }
            );
            // send email with magic link
            sendMagicLink(email, findUser.magicLink)
            res.status(200).json({ ok: true, message: 'Hit the link in email to sign in' })
        } 
        // Check if the magicLink sent from the client matches the one in the database and it is not expire
        else if (findUser.magicLink == magicLink && !findUser.magicLinkExpired) {
            // Find user and update
            await User.findOneAndUpdate(
                { email: email },
                { magicLinkExpired: true }
            )
            res.status(200).json({
                ok: true,
                message: "Welcome back",
                email,
                accessToken: generateToken(findUser)
               
            });
        } else {
            return res.json({ ok: false, message: "Magic link expired or incorrect 🤔. Please try again" });
        }
    } catch (error) {
        throw new Error("Invalid Credentials");
    }
})


module.exports = {
    RegisterUser,
    LoginUser
}