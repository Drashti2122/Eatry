const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'item name must be required!'],
        trim: true,
    },
    itemPrice: {
        type: String,
        required: [true, 'item price must be required!'],
        trim: true,
    },
    itemPicture: {
        type: String,
        required: [true, 'item picture must be required!'],
        trim: true,
    },
    subCategoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
        required: [true, 'Subcategory must be required!'],
    },
    foodType: {
        type: String,
        enum: ['Veg', 'nonVeg'],
        trim: true,
        required: [true, 'foodType must be required!'],
    }
    // payment_status: {
    //     type: String,
    //     required: [true, 'Payment status must be required!'],
    //     enum: ['pending', 'completed'],
    //     trim: true
    // }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Item', itemSchema);