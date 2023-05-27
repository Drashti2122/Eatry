const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const otpEmail = require('../utils/otp');
var otpGenerator = require('otp-generator');
const shortid = require('shortid');
const jwt = require('jsonwebtoken')
const Email = require("../utils/otp");

const OtpUser = require("../models/otpUser.model");
const Table = require("../models/table.model");

const { EmitEvent } = require('../socket');

const signToken = otp => {
    return jwt.sign({ otp }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (otp, statusCode, res, message) => {
    let otpToken = signToken(otp)
    if (otpToken) {
        res.status(statusCode).json({
            status: "success",
            statusCode,
            message,
            otpToken,
            userStatus: "active"
        })
    } else {
        res.status(statusCode).json({
            status: "fail",
            statusCode,
            message: "Something went wrong,please try again"
        })
    }
}

exports.sendEmailForOtp = catchAsync(async (req, res, next) => {
    let message = "Check email for otp";

    if (req.body.tableKey != 'undefined' && req.body.tableNo != 'undefined') {
        let tableId = await Table.find({ tableNo: req.body.tableNo });
        console.log(tableId)
        if (tableId) {
            let groupName = shortid.generate();
            const resetURL = `OTP`;
            generateOTP = () => {
                let OTP = otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: false });
                return OTP;
            };
            let otp = generateOTP()
            console.log(otp)

            // const tableExists=await OtpUser.find()
            let count = await OtpUser.find({ tableNo: tableId[0]._id, status: 'active' }).count();
            console.log(count)

            if (count == 0) {
                let key = await OtpUser.findOne({ tableNo: tableId[0]._id, status: 'inactive' }).select("tableKey")
                // console.log("tableKey" + key.tableKey)
                if (key) {
                    if (key.tableKey == req.body.tableKey) {
                        let createOtpUser = await OtpUser.create({
                            groupName: groupName,
                            otpEmail: req.body.otpEmail,
                            tableKey: req.body.tableKey,
                            tableNo: tableId[0]._id,
                            otp,
                            status: 'active'
                        })

                        if (createOtpUser) {
                            let updateTableStatus = await Table.findByIdAndUpdate(tableId[0]._id, { activeStatus: 'active' });
                            if (updateTableStatus.length !== 0) {
                                EmitEvent("activestatus", "status Active")
                                try {
                                    await new Email(otp, resetURL).sendOtp().then(() => {
                                        res.status(200).json({
                                            status: 'success',
                                            statusCode: 200,
                                            message: 'Check your email'
                                        });
                                    });
                                } catch (err) {
                                    return next(new AppError('There was an error sending the email.Try again later!'), 400)
                                }
                            } else {
                                return next(new AppError('There was an error sending the email.Try again later!'), 400)
                            }

                        } else {
                            return next(new AppError('Somthing wrong!Please try again'), 400)
                        }
                    } else {
                        return next(new AppError('Scan again'), 400)
                    }
                } else {
                    let createOtpUser = await OtpUser.create({
                        groupName: groupName,
                        otpEmail: req.body.otpEmail,
                        tableKey: req.body.tableKey,
                        tableNo: tableId[0]._id,
                        otp,
                        status: 'active'
                    })

                    if (createOtpUser) {
                        let updateTableStatus = await Table.findByIdAndUpdate(tableId[0]._id, { activeStatus: 'active' });
                        if (updateTableStatus.length !== 0) {
                            EmitEvent("activestatus", "status Active")
                            try {
                                await new otpEmail(otp, resetURL).sendOtp().then(() => {
                                    res.status(201).json({
                                        status: 'success',
                                        statusCode: 201,
                                        message: 'Check your email'
                                    });
                                });
                            } catch (err) {
                                return next(new AppError('There was an error sending the email.Try again later!'), 400)
                            }
                        } else {
                            return next(new AppError('There was an error sending the email.Try again later!'), 400)
                        }

                    } else {
                        return next(new AppError('Somthing wrong!Please try again'), 400)
                    }
                }
            }
        } else {
            return next(new AppError('Somthing wrong!Please scan again'), 500)
        }
    } else {
        return next(new AppError('Somthing wrong!Please scan again'), 500)
    }
});

exports.getOtpUsers = catchAsync(async (req, res, next) => {
    if (req.body.tableNo != 'undefined' && req.body.tableNo != 'undefined') {
        let tableNo = await Table.findOne({ tableNo: req.body.tableNo });
        if (tableNo) {
            let otpUserExists = await OtpUser.find({ tableKey: req.body.tableKey, tableNo: tableNo._id, status: 'active' });
            if (otpUserExists.length !== 0) {
                res.status(200).json({
                    status: 'success',
                    statusCode: 200,
                    message: "success",
                    data: otpUserExists
                });
            }
        }
    }
});

exports.checkExists = catchAsync(async (req, res, next) => {
});

exports.matchOTP = catchAsync(async (req, res, next) => {
    let message = "welcome to our eatry"
    let match = await OtpUser.compareOtp(req.body.otp);
    console.log("match otp" + match)
    if (match) {
        createSendToken(match.otp, 200, res, message);
    } else {
        return next(new AppError('Please re-enter otp'), 400)
    }

});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
    console.log("current" + req.otpUser)
    let currentUser = await OtpUser.findById(req.otpUser[0]._id);
    if (currentUser) {
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "success",
            data: currentUser
        });
    }
});