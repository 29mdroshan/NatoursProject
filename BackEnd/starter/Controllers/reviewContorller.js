const Review = require('./../models/reviewModel.js')
const catchAsyn = require('./../utils/CatchAsyn.js')
const AppError = require('./../utils/AppError.js')
const factory = require('./handlerFactory.js')

const sendResponse = (review, statusCode, res) =>{
    res.status(statusCode).json({
        status:'success',
        lenght: review.length,
        data: {
            review
        }
    });
}

// exports.getAllReviews = catchAsyn(async(req, res) => {
//     let filter ={}
//     if(req.params.tourId) filter = {tour : req.params.tourId}
//     const reviews = await Review.find(filter)
//     sendResponse(reviews, 200, res)

// });

exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.setTourUserIds = (req,res,next) => {
    // nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id
    next();
}

exports.createReview = factory.createOne(Review);
// exports.createReview = catchAsyn(async(req, res) => {
//     // nested routes
//     if(!req.body.tour) req.body.tour = req.params.tourId;
//     if(!req.body.user) req.body.user = req.user.id
//     const newReview = await Review.create(req.body);
//     sendResponse(newReview, 201, res)
// })

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);

// exports.deleteReview = catchAsyn(async(req, res) => {
//     await Review.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//         status:'success',
//         message: 'Review deleted'
//     });
// })

exports.setUserEmail = (req,res,next) => {
    if(!req.params.userEmail) req.params.userEmail = req.user.email;
    next();
}

exports.getAllReviewsByMe = catchAsyn(async(req, res) => {
    const newReview = await Review.findByUserEmail(req.user.email);
    sendResponse(newReview, 201, res)
});


  
