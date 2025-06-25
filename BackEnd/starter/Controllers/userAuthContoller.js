const { promisify } = require('util')
const User = require('./../models/userModel.js')
const catchAsyn = require('./../utils/CatchAsyn.js')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/AppError.js')
const sendEmail = require('./../utils/Email.js')
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN}); 
}

const creatSendToken = (user, statusCode, res) =>{
    const token = signToken(user._id);

    const cookiesOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') {
        cookiesOption.secure = true;
    }
    res.cookie('jwt', token, cookiesOption)

    res.status(statusCode).json({
        status:'success',
        token: token
    });
}

const isTokenRecentlyExpired = (expTime) => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expiredTimeBuffer = 5 * 60; // 5 minutes buffer
    return (currentTime - expTime <= expiredTimeBuffer);
};

exports.signup = catchAsyn(async (req, res, next) =>{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        photo: 'defaultUser.jpg'
    });

    (newUser, 201, res);

    // const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN}); 

    // res.status(201).json({
    //     status:'success',
    //     token: token,
    //     data: newUser
    // });
})



exports.login = catchAsyn(async (req, res, next) =>{
    const {email, password} = req.body;

    // 1) check if email and password exists
    // 2) check if user exist && password are correct
    // 3) generate JWT token and send it to the client

    if(!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    //select is used for hidden fields
    const user = await User.findOne({email: email}).select('+password');

    if(!user) {
        return next(new AppError(`You don't have a account, Please Sign Up`, 404));
    }

    const correct = await user.correctPassword(password, user.password);

    if(!user || !correct) {
        return next(new AppError('Incorrect email or password', 401));
    }

    creatSendToken(user, 200, res)

    // const token = signToken(user._id);

    // res.status(200).json({
    //     status:'success',
    //     token: token
    // })
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 0 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        status:'success'
    })
}

exports.protect = catchAsyn(async(req, res, next) => {
    //1) getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if(!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    
    // //2) verification token
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
       return next(new AppError('Your session has expired. Please log in again.', 401));
    }

    //3) check if user still exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    //4) check if user changed password after token was created
    if(freshUser.changesPaswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    //Grant user access to
    req.user = freshUser;
   
    next();
})

exports.isLoggedIn = catchAsyn(async(req, res, next) => { 
    if(req.cookies.jwt && req.cookies.jwt !== 'loggedout') {

        //1) verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET_KEY);

        //2) check if user still exists
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            return next();
        }

         //3) check if user changed password after token was created
        if(currentUser.changesPaswordAfter(decoded.iat)) {
            return next();
        }
        return next();
    }
    next();
})


exports.restrictTo = (...roles) => {
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }
        next();
    }
}



exports.forgotPassword = catchAsyn(async(req, res, next) => {
    
    if(!req.body.email) {
        return next(new AppError('Please provide an email address.', 400));
    }
    //1) Get user based posted email
    const user = await User.findOne({email : req.body.email});
    if(!user) {
        return next(new AppError('No user found with that email.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save( {validateBeforeSave: false});

    // 3) send email notification
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`
    const message = `Forgot your Password? Submit a Patch request with your new password and passwordConfirm to : ${resetURL} \n Your reset token : ${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })

        res.status(200).json({
            status:'success',
            message: 'Token sent to email!'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending the email. Try again later!'),500);
    }

})

exports.resetPassword = catchAsyn(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    creatSendToken(user, 200, res);
  });


exports.updatePassword = catchAsyn(async(req,res,next) =>{
   // Get user from collection based on token
   const user = await User.findById(req.user.id).select('+password');

   // Check if posted current password is correct
    if(!req.body.currentPassword) {
        return next(new AppError('Please enter your current password',500));
    }

    if(!(user.correctPassword(req.body.currentPassword, user.password))){
        return next(new AppError('Your current password is wrong', 401));
   }

   //update the password
   if(!req.body.newPassword || !req.body.passwordConfirm) {
    return next(new AppError('Please provide a newPassword and passwordConfirm', 400));
   }

   user.password = req.body.newPassword;
   user.passwordConfirm = req.body.passwordConfirm;
   await user.save();

   //sign the new token and send it back to the client
   creatSendToken(user, 200, res)

})


