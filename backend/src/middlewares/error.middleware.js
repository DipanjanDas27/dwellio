const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: err.success || false,
        statusCode: statusCode,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        data: err.data || null,
        stack:  err.stack || null
    });

};

export { errorHandler };