const Booking = require('./../models/bookingModel.js')
const APIFeatures = require('./../utils/apiFeatures.js')
const CatchAsyn = require('./../utils/CatchAsyn.js')
const AppError = require('./../utils/AppError.js')
const factory = require('./handlerFactory.js')

const sendResponse = (booking, statusCode, res) =>{
    res.status(statusCode).json({
        status:'success',
        data: {
            booking
        }
    });
}

exports.setTourUserIds = (req,res,next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    next();
}

exports.setUserEmail = (req,res,next) => {
    if(!req.params.userEmail) req.params.userEmail = req.user.email;
    next();
}

exports.createBooking = CatchAsyn(async(req, res) => {
    const newBooking = await Booking.create(req.body);
    sendResponse(newBooking, 201, res)
})

exports.getBookings = CatchAsyn(async (req, res, next) => {
    const bookings = await Booking.findByUserEmail(req.user.email);
    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
           data :bookings
        }
    });
});

exports.getAllBookings = CatchAsyn(async (req, res, next) => {
    const bookings = await Booking.find()       
        .populate('tour');
       
    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
           data :bookings
        }
    });
});

exports.updateBookingRatingStatus = factory.updateOne(Booking);