const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableName: {
        type: String,
        required: [true, 'Table name must be required!'],
        trim: true,
    },
    tableNo: {
        type: Number,
        required: [true, 'Table number must be required!'],
        trim: true,
    },
    status: {
        type: String,
        required: [true, 'Table status must be required!'],
        enum: ['available', 'reserved'],
        trim: true,
        default: 'available'
    },
    activeStatus: {
        type: String,
        required: [true, 'Table Active status must be required!'],
        enum: ['active', 'inactive'],
        trim: true,
        default: 'inactive'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Table', tableSchema);