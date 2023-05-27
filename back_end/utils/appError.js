class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor); //new object is created,and a constructor function is called and 
        //that function call is not gonna appear in the stack trace
    }
}
module.exports = AppError;