const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'Item must be required!'],
        trim: true,
    },
    customerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        // required: [true, 'Customer must be required!'],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Order quantity must be required!'],
        trim: true,
    },
    totalPrice: {
        type: Number,
        required: [true, 'Order total price must be required!'],
        trim: true,
    },
    dishStatus: {
        type: String,
        required: [true, 'Order dish status must be required!'],
        enum: ['full', 'half'],
        default: 'full',
        trim: true,
    },
    status: {
        type: String,
        required: [true, 'Order status must be required!'],
        enum: ['pending', 'completed'],
        trim: true,
        default: 'pending'
    },
    tableNo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Table',
        required: [true, 'Table number must be required!'],
    },
    payment_status: {
        type: String,
        required: [true, 'Payment status must be required!'],
        enum: ['pending', 'completed'],
        trim: true
    },
    otpUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'OtpUser',
        required: [true, 'Otp User must be required!'],
    },
    // role: {
    //     type: String,
    //     required: [true, 'Role must be required!'],
    //     enum: ['otpUser', 'user'],
    //     default: 'none'
    // }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);