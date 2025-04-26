const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: Object.values(err.errors).map(error => error.message)
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            error: 'Email already exists'
        });
    }

    // Default error
    res.status(500).json({
        error: 'Something went wrong! Please try again later.'
    });
};

module.exports = errorHandler; 