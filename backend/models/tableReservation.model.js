const mongoose = require('mongoose');

const tableReservationSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Table',
        required: [true, 'TableId must be required!'],
    },
    customerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'CustomerId must be required!'],
    },
    bookingDate: {
        type: String,
        required: [true, 'Booking Date must be required!'],
        trim: true,
    },
    bookingInTime: {
        type: String,
        required: [true, 'Booking Intime must be required!'],
        trim: true
    },
    bookingOutTime: {
        type: String,
        required: [true, 'Booking Outtime must be required!'],
        trim: true
    },
    contactNo: {
        type: String,
        required: [true, 'Booking contact number must be required!'],
        trim: true,
        validate: {
            validator: function (e) {
                const exp = /^(0|91)?[6-9][0-9]{9}$/;
                return typeof e === 'string' && e.length > 0 && e.match(exp);
            },
            message: "Invalid Contact Number"
        }
    },
    payment_status: {
        type: String,
        required: [true, 'Payment status must be required!'],
        enum: ['complete', 'pending']
    },
    payment_intent: {
        type: String,
        required: [true, 'Payment intent must be required!'],
        default: "null"
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

module.exports = mongoose.model('TableReservation', tableReservationSchema);
    //booking_currentTime: {
        //     type: Date,
        //     required: [true, 'Current Booking time must be required!'],
        //     trim: true,
        // },
        // fromSlot: {
        //     type: String,
        //     required: [true, 'From slot must be required!'],
        //     trim: true,
        //     // enum: ["P1","P2","P3","P4","P5","P6","P7","P8","P9","A9","A11","A12"]
        // },
        // toSlot: {
        //     type: String,
        //     required: [true, 'To slot must be required!'],
        //     trim: true,
        //     // enum: ["P2","P3","P4","P5","P6","P7","P8","P9","A9","A10","A11", "A12"]
        // },