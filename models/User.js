const mongoose = require('mongoose'); // Erase if already required
const { v4: uuidv4 } = require('uuid');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        profilePic: {
            type: String,
        },
        role: {
            type: String,
            default: "user",
        },
        magicLink: { 
            type     : String, 
            required : false,
            unique   : false,
            default  : uuidv4
        },
        magicLinkExpired: { 
            type     : Boolean, 
            default  : false
        }
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model('User', userSchema);