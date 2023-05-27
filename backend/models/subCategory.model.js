const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    subCategoryName: {
        type: String,
        required: [true, 'subCategory name must be required!'],
        trim: true,
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'CategoryId name must be required!'],
        trim: true,
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('SubCategory', subCategorySchema);