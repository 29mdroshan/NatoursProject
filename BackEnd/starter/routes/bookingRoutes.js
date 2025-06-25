const express = require('express');
const bookingContoller = require('./../Controllers/bookingController.js');
const authController = require('./../Controllers/userAuthContoller.js')

const router = express.Router({ mergeParams : true})

router
  .route('/')
  .get(authController.protect, authController.restrictTo('user',), bookingContoller.setUserEmail, bookingContoller.getBookings)
  .post(authController.protect, authController.restrictTo('user'), bookingContoller.createBooking)

router
  .route('/all')
  .get(authController.protect, authController.restrictTo('admin'), bookingContoller.getAllBookings)

router
  .route('/:id')
  .patch(authController.protect, authController.restrictTo('user', 'admin'), bookingContoller.updateBookingRatingStatus)

module.exports = router;