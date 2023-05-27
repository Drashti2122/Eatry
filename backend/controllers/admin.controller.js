const Admin = require('../models/admin.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const crypto = require('crypto');
const Email = require("../utils/email");
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });

/*  
 * id:id of user,which want to login or register
 */
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

/*
 * user:data of user,which want to login or register)
 * statusCode:it gives statuscode according to response
 * res:get back response from api request
 * message:it gives message according to request(request either login or register)
 */

const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user._id)
    if (token) {
        res.status(statusCode).json({
            status: "success",
            statusCode,
            message,
            email: user.email,
            token,
        })
    } else {
        res.status(statusCode).json({
            status: "fail",
            statusCode,
            message: "Something went wrong,please try again"
        })
    }
}

/*
 * req:request for login(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.signIn = catchAsync(async (req, res, next) => {
    // //console.log("hii")
    // const saveAdmin = await Admin.create({
    //     name: "Drashti Kalathiya",
    //     email: "drashtikalathiya44@gmail.com",
    //     password: "Drashti@123",
    //     passwordConfirm: "Drashti@123",
    //     contactNo: "9377726721"

    // });
    // res.status(201).json({
    //     status: 'success',
    //     statusCode: 201,
    //     message: "Topic successfully created",
    //     data: saveAdmin
    // })
    // //console.log("hii")
    // //console.log(req.body)
    try {
        const { email, password } = req.body;
        const message = "Login successfully";

        //1)Check if email and password exist
        if (!email || !password) {
            return next(new AppError("Please provide email and password", 400))
        }

        //2)Check if admin exists && password is correct
        const admin = await Admin.findOne({ email }).select("password").select("email");

        // //console.log(admins)
        if (!admin || !await admin.correctPassword(password, admin.password)) {
            return next(new AppError("Incorrect email and password", 401))
        }

        //3)If everything ok,send token to client
        createSendToken(admin, 200, res, message);
    } catch (e) {
        //console.log(e)
    }

});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1)Get user based on POSTed email
    const admin = await Admin.findOne({ email: req.body.email });
    // //console.log(user);
    if (!admin) {
        return next(new AppError('There is no user with email address.', 404))
    }

    //2)Generate the random reset token
    const resetToken = admin.createPasswordResetToken();
    await admin.save({ validateBeforeSave: false })

    //3)send it to user's email 
    const resetURL = `${req.protocol}://localhost:${process.env.USER_PORT}/auth/reset`;

    try {
        await new Email(user, resetURL).sendPasswordReset().then(() => {
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Check your email',
                email: admin.email,
                token: resetToken
            });
        });

    } catch (err) {
        admin.passwordResetToken = undefined;
        admin.passwordResetExpires = undefined;
        await admin.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email.Try again later!'), 500)
    }

});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //console.log("token" + req.params.token)
    const message = "Reset  successfully";
    // 1)Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const admin = await Admin.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    //2)If token has not expired,and there is user,set the new password
    if (!admin) {
        return next(new AppError('unauthorized', 400))
    }
    admin.password = req.body.password;
    admin.passwordConfirm = req.body.passwordConfirm;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();

    //3)Update changePasswordAt property for the current user

    //4)Log the user in,send JWT
    createSendToken(admin, 200, res, message);

});
exports.changePassword = catchAsync(async (req, res, next) => {
    const message = "Password change succcessfully";

    //1)Get user from collection
    const admin = await Admin.findById(req.admin.id).select('+password')
    //console.log(admin)

    //2)Check if Posted current password is correct
    if (!(await admin.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    //3)If so,update password
    admin.password = req.body.newPassword;
    admin.passwordConfirm = req.body.confirmPassword;
    await admin.save();
    //User.findByIdAndUpdate will NOT work as intended!

    //4)Log user in,send JWT
    createSendToken(admin, 200, res, message);
});

exports.getAdmin = catchAsync(async (req, res, next) => {
    //console.log(req.params.email)
    const data = await Admin.find({ email: req.params.email })
    if (data) {
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Current Admin",
            data: data
        })
    } else {
        return next(new AppError('Record not found', 404))
    }
});

// exports.firebaseToken = catchAsync(async (req, res, next) => {
//     //console.log("hii")
//     if (req.body.token) {
//         res.cookie('myCookie', req.body.token, { maxAge: 900000, httpOnly: true });

//     }
//     // //console.log(req.body.token)
//     // next();
// })
exports.addDeviceToken = catchAsync(async (req, res, next) => {
    // //console.log(req)
    const addToken = await DeviceToken.create({
        emailID: req.body.emailID,
        deviceToken: req.body.deviceToken
    });
    if (addToken) {
        // //console.log("Token sucessfully added")
    }
})
