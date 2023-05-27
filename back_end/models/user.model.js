const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User name must be required!'],
        trim: true,
    },
    userEmail: {
        type: String,
        required: [true, 'User email must be required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Please provide valid email(abc@gmail.com)"],
    },
    userContactNo: {
        type: String,
        unique: true,
        required: [true, 'Contact no must be required'],
        trim: true,
        validate: {
            validator: function (e) {
                const exp = /^(0|91)?[6-9][0-9]{9}$/;
                return typeof e === 'string' && e.length > 0 && e.match(exp);
            },
            message: "Invalid Contact Number"
        }
    },
    userPassword: {
        type: String,
        required: [true, "Password must be required"],
        trim: true,
        validate: {
            validator: function (e) {
                const exp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
                const pwd = e.match(exp)

                const ans = JSON.parse((JSON.stringify(e)).replaceAll(" ", ''))
                return ans
                // const ans = JSON.parse((JSON.stringify(pwd.input)).replaceAll(" ", ''))
                // return ans
            },
            message: "Minimum eight characters, at least one letter, one number and one special character and not allow space between character"
        }
        // Minimum eight characters, at least one letter, one number and one special character
    },
    userPasswordConfirm: {
        type: String,
        trim: true,
        required: [true, 'Confirm password must be required'],
        validate: {
            validator: function (el) {
                return el === this.userPassword;
            },
            message: 'Password and confirmPassword must be same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

//hash is sync and async both,but sync prevent the block so we use async hash
userSchema.pre('save', async function (next) {
    //Only run this function if password was actually modified
    if (!this.isModified('userPassword')) return next();

    //hash the password with cost of 12
    this.userPassword = await bcrypt.hash(this.userPassword, 12);

    //Delete passwordConfirm field
    this.userPasswordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});


userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // console.log("candidate" + candidatePassword + " " + userPassword);
    return await bcrypt.compare(candidatePassword, userPassword)
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
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

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);