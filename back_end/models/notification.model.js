const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Notification description must be required!'],
        trim: true,
    },
    status: {
        type: String,
        required: [true, 'Notification status must be required!'],
        enum: ['read', 'unread'],
        trim: true
    },
    otpUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'OtpUser',
        required: [true, 'OtpUser must be required!'],
        // populate: { path: 'tableNo', select: 'tableName' }
    },
    tableId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Table',
        required: [true, 'tableId must be required!'],
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'itemId must be required!'],
    }
});

module.exports = mongoose.model('Notification', notificationSchema);