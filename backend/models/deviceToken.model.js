const mongoose = require('mongoose');

const deviceTokenSchema = new mongoose.Schema({
    emailID:{
        type:String,
        required:[true,'EmailID must be required!'],
        trim:true
    },
    deviceToken: {
        type: String,
        required: [true, 'Device token must be required!'],
        trim: true,
    },
});

module.exports = mongoose.model('DeviceToken', deviceTokenSchema);