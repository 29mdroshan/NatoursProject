const express = require('express');
const router  =  express.Router();
const tourController = require('./../Controllers/tourController.js');
const authController = require('./../Controllers/userAuthContoller.js')
const reviewRouter = require('./reviewRoutes.js');
const bookingContoller = require('./../Controllers/bookingController.js');
// const reviewController = require('./../Controllers/reviewContorller.js')

// router
//    .route('/:tourId/reviews')
//    .post(
//      authController.protect,
//      authController.restrictTo('user'),
//      reviewController.createReview
//    )

// router.use(authController.isLoggedIn)

router.use('/:tourId/reviews', reviewRouter)

// router.param('id', tourController.checkId)
router.route('/topTour')
   .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/getTourStats')
   .get(tourController.getTourStats);

router.route('/getMonthlyPlan/:year')
   .get(authController.protect, authController.restrictTo('admin'), tourController.monthlyPlan);


router.route('/tour-within/distance/:distance/center/:latlng/unit/:unit')
   .get(tourController.getToursWithin)

router.route('/')
   .get(tourController.getAllTours)
   .post(authController.protect,authController.restrictTo('admin'), tourController.createTour);

router.route('/:id')
   .get(tourController.getTour)
   .patch(authController.protect,authController.restrictTo('admin'),tourController.updateTour)
   .delete(authController.protect, authController.restrictTo('admin'), tourController.deleteTour);

router
   .route('/:tourId/bookings')
   .post(
     authController.protect,
     authController.restrictTo('user'),
     bookingContoller.setTourUserIds,
     bookingContoller.createBooking
   )



module.exports = router;