const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const otpUserSchema = new mongoose.Schema({
    otpEmail: {
        type: String,
        required: [true, 'Email must be required!'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide valid email(abc@gmail.com)"],
    },
    groupName: {
        type: String,
        required: [true, 'Group name must be required!'],
        trim: true,
        unique: true,
    },
    tableKey: {
        type: String,
        required: [true, 'Table Key must be required'],
        lowercase: true,
        trim: true,
    },
    tableNo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Table',
        required: [true, 'table number must be required!'],
    },
    otp: {
        type: String,
        required: [true, 'Otp must be required'],
        unique: true,
        trim: true,
    },
    status: {
        type: String,
        required: [true, 'Status must be required'],
        enum: ['active', 'inactive'],
        trim: true,
    },
    otpResetExpires: Date,
});

//hash is sync and async both,but sync prevent the block so we use async hash
otpUserSchema.pre('save', async function (next) {
    //Only run this function if password was actually modified
    if (!this.isModified('otp')) return next();

    //hash the password with cost of 12
    this.otp = await bcrypt.hash(this.otp, 12);
    this.otpResetExpires = Date.now() + 10 * 60 * 1000;
    next();
});

// otpUserSchema.methods.correctOtp = async function (
//     candidateOtp,
//     userOtp
// ) {
//     console.log("candidate" + candidateOtp + " " + userOtp);
//     return await bcrypt.compare(candidateOtp, userOtp)
// };

otpUserSchema.statics.compareOtp = async function (otp) {
    // Find all records in the collection
    const records = await this.find({});

    // Loop through each record and compare the OTP
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const isMatch = await bcrypt.compare(otp, record.otp);
        if (isMatch) {
            return record;
        }
    }

    return null; // No match found
};


module.exports = mongoose.model('OtpUser', otpUserSchema);