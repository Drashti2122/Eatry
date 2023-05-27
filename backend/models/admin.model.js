const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email must be required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Please provide valid email(abc@gmail.com)"]
    },
    password: {
        type: String,
        required: [true, "Password must be required"],
        trim: true,
        validate: {
            validator: function (e) {
                const exp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
                const pwd = e.match(exp)
                return pwd
                // const ans = '';
                // if (pwd != null) {
                //     ans = JSON.parse((JSON.stringify(e)).replaceAll(" ", ''))
                //     return ans
                // }

                // const ans = JSON.parse((JSON.stringify(pwd.input)).replaceAll(" ", ''))
                // return ans
            },
            message: "Minimum eight characters, at least one letter, one number and one special character and not allow space between character"
        }
        // Minimum eight characters, at least one letter, one number and one special character
    },
    passwordConfirm: {
        type: String,
        trim: true,
        required: [true, 'Confirm password must be required'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password and confirmPassword must be same!'
        }
    },
    contactNo: {
        type: String,
        unique: true,
        required: [true, 'Contact name must be required'],
        trim: true,
        validate: {
            validator: function (el) {
                const exp = /^(0|91)?[6-9][0-9]{9}$/;
                return el.match(exp)
            },
            message: "Invalid Contact Number"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

//hash is sync and async both,but sync prevent the block so we use async hash
adminSchema.pre('save', async function (next) {
    //Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

adminSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

adminSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // console.log("candidate pa                                                                                                         
    return await bcrypt.compare(candidatePassword, userPassword)
};

adminSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        console.log(JWTTimestamp, changedTimeStamp);
        return JWTTimestamp < changedTimeStamp //100<200
    }

    //False means not changed
    return false;
}

adminSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model('Admin', adminSchema);