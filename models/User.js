const mongoose = require('mongoose'); // Erase if already required
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        picture: {
            type: String,
        },
        location: {
            type: String,
        },
        role: {
            type: String,
            default: "user",
        },
        emailVerified: { // Indicate whether user emailToken send by email has been verified
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model('User', userSchema);