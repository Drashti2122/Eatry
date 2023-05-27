const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const crypto = require('crypto');
const Email = require("../utils/email");
const dotenv = require('dotenv');
const otpUserModel = require("../models/otpUser.model");
dotenv.config({ path: "./config.env" });

/*  
 * id:id of user,which want to login or register
 */
const signToken = id => {
    //console.log(process.env.JWT_SECRETS)
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
    //console.log(user._id)
    const token = signToken(user._id)
    if (token) {
        res.status(statusCode).json({
            status: "success",
            statusCode,
            message,
            email: user.userEmail,
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

exports.signUp = catchAsync(async (req, res, next) => {
    //console.log("hii")
    //console.log(req.body)
    const addUsers = await User.create({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userContactNo: req.body.userContactNo,
        userPassword: req.body.userPassword,
        userPasswordConfirm: req.body.userPasswordConfirm
    });

    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: "Registered successfully",
    })
});


/*
 * req:request for login(contain data that user give)
 * res:get back response from api request
 * next:is middleware
 */
exports.signIn = catchAsync(async (req, res, next) => {
    try {
        const { userEmail, userPassword } = req.body;
        const message = "Login successfully";
        //1)Check if email and password exist
        if (!userEmail || !userPassword) {
            return next(new AppError("Please provide email and password", 404))
        }

        //2)Check if admin exists && password is correct
        const user = await User.findOne({ userEmail }).select("userPassword").select("userEmail");
        // //console.log("user:" + user)

        if (!user || !await user.correctPassword(userPassword, user.userPassword)) {
            return next(new AppError("Incorrect email and password", 401))
        }

        //console.log(user);
        //3)If everything ok,send token to client
        createSendToken(user, 200, res, message);
    } catch (e) {
        //console.log(e)
    }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1)Get user based on POSTed email
    if (req.body.userEmail) {
        return next(new AppError('Please provide youe emailID', 404))
    }
    const user = await User.findOne({ userEmail: req.body.userEmail });
    // //console.log(user);
    if (!user) {
        return next(new AppError('There is no user with email address.', 404))
    }

    //2)Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })

    //3)send it to user's email 
    const resetURL = `${req.protocol}://localhost:${process.env.USER_PORT}/home/forgot/reset`;

    try {
        await new Email(user, resetURL).sendPasswordReset().then(() => {
            res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Check your email',
                email: user.userEmail,
                token: resetToken
            });
        });

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Something wrong!!Please try again'), 400)
        // return next(new AppError('There was an error sending the email.Try again later!'), 500)
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    if (req.body.password != req.body.passwordConfirm) {
        return next(new AppError('password and confirm must be same', 400))
    }
    //console.log("token" + req.params.token)
    const message = "Reset successfully";
    // 1)Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    //2)If token has not expired,and there is user,set the new password
    if (!user) {
        return next(new AppError('Unauthorized!!time expired', 400))
    }
    user.userPassword = req.body.password;
    user.userPasswordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //3)Update changePasswordAt property for the current user

    //4)Log the user in,send JWT
    createSendToken(user, 200, res, message);

});

exports.getAllUser = catchAsync(async (req, res, next) => {
    const getAllUser = await User.find();

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Get all user successfully',
        data: getAllUser
    });
});
