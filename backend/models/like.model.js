const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'ItemId must be required!'],
    },
    count: {
        type: Number,
        required: [true, 'Likes count must be required!'],
        trim: true,
    }
});

module.exports = mongoose.model('Like', likeSchema);