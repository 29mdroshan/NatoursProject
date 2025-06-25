const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please enter your name"],
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: [true,"Please enter your email"],
        unique: true,
        lowercase: true,
        RegExp:['[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}','Please provide a valid email address']
    },
    // phone:{
    //     type: String,
    //     unique: true,
    //     minlength:10,
    //     maxlength:10,
    //     validate: {
    //         validator: function(el) {
    //             return el*1;
    //         },
    //         message: "Phone number must be a number"
    //     }
    // },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'admin'],
        default: 'user'
    },
    password:{
        type: String,
        required: [true,"Please provide a password"],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true, "Please confirm your password"],
        select: false,
        validate: {
            // This only works on create and save
            validator: function(el) {
                return el === this.password;
            },
            message: "Confirm password does not match with password"
        }
    },
    PasswordChangedAt : {
        type:Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type:Date,
        select: false
    },
    active:{
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save',async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
        next();
    }
})

userSchema.pre('save', function(next) {
    if(this.isModified('passwordConfirm') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();

    //2521147, 611459
})

userSchema.methods.correctPassword =  async function(candidatePassword, userPassword) {
    return  await bcrypt.compare( candidatePassword, userPassword)
}

userSchema.methods.changesPaswordAfter = function(JwtTimeStamp) {
    if(this.PasswordChangedAt) {
        const changedTimeStamp = parseInt(this.PasswordChangedAt.getTime() / 1000, 10);
        return JwtTimeStamp < changedTimeStamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
                                .createHash('sha256').update(resetToken).digest('hex');;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('user',userSchema);

module.exports = User;