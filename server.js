const express = require('express');
require('colors');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT | 5000;


// Accessing Database Connection
const connectDB = require('./config/db_connect')
// Called Database Connection Function
connectDB();

// Server app __ Initiating
const app = express();

// Middleware :: to read body data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(passport.initialize());


// Endpoints
// Auth Routes Endpoint
app.use('/api/auth', require('./routes/authRoutes'))


// Listening
app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`.cyan.underline)
})