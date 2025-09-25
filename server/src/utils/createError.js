const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode || 500;
    error.isOperational = true;
    return error;
};

export default createError;
