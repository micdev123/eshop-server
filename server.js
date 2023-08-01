const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const createError = require('http-errors')
const morgan = require('morgan');
require('colors');
require('dotenv').config();

const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT | 5000;


// Accessing Database Connection
const connectDB = require('./config/db_connect')
// Called Database Connection Function
connectDB();

// Server app __ Initiating
const app = express();



// Middleware :: to read body data
app.use(express.json()); // Parse incoming JSON payloads in the HTTP request body.
app.use(express.urlencoded({ extended: false })); // Parse incoming URL-encoded form data in the HTTP request body.


app.use(helmet()); // Set various HTTP headers to improve the security of an Express.js application.
app.use(morgan('dev')) //  Log HTTP requests and responses in the "dev" format. 
app.use(cors()); // Prevents malicious scripts from making unauthorized requests to another domain or website that a user is logged into


// Middleware to set the Referrer-Policy header
app.use((req, res, next) => {
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    next();
});


// Endpoints
// Auth Routes Endpoint
app.use('/auth', require('./routes/authRoutes'))


// Handling error
app.use((req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        status: err.status || 500,
        message: err.message,
    })
})



// Listening
app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`.cyan.underline)
})