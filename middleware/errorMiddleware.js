// Not Found
const notFound = (req, res, next) => {
    const notFoundError = new Error(`Unidentified : ${req.originalUrl}`);
    res.status(404);
    next(notFoundError);
}

// 
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    res.json({
        message: err?.message,
        stack: process.env.NODE_ENV === 'production' ? null : err?.stack
    })
}

module.exports = {
    notFound,
    errorHandler,
}