const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Table',
        required: [true, 'tableId must be required!'],
        trim: true,
    },
    otpUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'OtpUser',
        required: [true, 'otpUserId must be required!'],
        trim: true,
    },
    total: {
        type: String,
        required: [true, 'Total name must be required!'],
        trim: true,
    },
    status: {
        type: String,
        required: [true, 'Total name must be required!'],
        enum: ['pending', 'complete'],
        default: 'pending',
        trim: true,
    }
});

module.exports = mongoose.model('Bill', billSchema);