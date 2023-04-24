const mongoose = require('mongoose')

// Connection function
const connectDB = async () => {
    // try-catch block
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI) // connection
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    }
    catch (error) {
        console.log(error);
        // exit the process with failure of 1
        process.exit(1)
    }
}

module.exports = connectDB;