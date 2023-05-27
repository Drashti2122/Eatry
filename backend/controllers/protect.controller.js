const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken')
const { promisify } = require('util');
const OtpUser = require('../models/otpUser.model');

exports.protect = catchAsync(async (req, res, next) => {
    //console.log("hello")
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     token = req.headers.authorization.split(' ')[1];
    // }
    // if (!token) {
    //     return next(new AppError('You are not logged in! Please log in to get access.', 401))
    // }
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // freshAdmin = await Admin.findById(decoded.id);
    // if (freshAdmin) {
    //     req.admin = freshAdmin;
    // }
    // next();

    // ==================

    let token;
    let tokens;
    let freshAdmin;
    let freshUser;
    let freshOtpUser;

    if (req.query.role == 'otpUser') {
        if (req.query.auth) {
            tokens = req.query.auth
        }
        // //console.log(token);
        if (!tokens) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401))
        }

        const decoded = await promisify(jwt.verify)(tokens, process.env.JWT_SECRET)
        // //console.log(decoded.otp)
        freshOtpUser = await OtpUser.find({ otp: decoded.otp });

        if (!freshOtpUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401))
        }
    }

    if (req.query.role == 'admin' || req.query.role == 'user') {
        if (req.query.auth) {
            token = req.query.auth
        }
        // //console.log(token);
        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401))
        }

        //2)Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        //console.log(decoded)

        //3)log in again
        if (req.query.role == 'admin') {
            freshAdmin = await Admin.findById(decoded.id);
            if (!freshAdmin) {
                return next(new AppError('The user belonging to this token does no longer exist.', 401))
            }
        }
        if (req.query.role == 'user') {
            freshUser = await User.findById(decoded.id);
            if (!freshUser) {
                return next(new AppError('The user belonging to this token does no longer exist.', 401))
            }
        }
    }

    // //4)Check if user changed password after the token was issued
    // if (freshAdmin.changePasswordAfter(decoded.iat) || freshUser.changePasswordAfter(decoded.iat)) {
    //     return next(new AppError('User recently changed password!Please log in again.', 401))
    // }
    if (freshAdmin) {
        req.admin = freshAdmin;
    }
    if (freshUser) {
        req.user = freshUser;
    }
    if (freshOtpUser) {
        req.otpUser = freshOtpUser;
    }
    next();
})
