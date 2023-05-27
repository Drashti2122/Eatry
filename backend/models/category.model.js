const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [true, 'Category name must be required!'],
        trim: true,
    },
});

module.exports = mongoose.model('Category', categorySchema);