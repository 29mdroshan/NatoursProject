const express = require('express');
// const router = express.Router();
const reviewController = require('./../Controllers/reviewContorller.js')
const authController = require('./../Controllers/userAuthContoller.js')
// mergeParams is used to get paramater(:tourId) from tour routes for api /tour/:tourId/reviews
const router = express.Router({ mergeParams : true})

// router.use(authController.protect)

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, authController.restrictTo('user'), reviewController.setTourUserIds,reviewController.createReview)
  
router
.route('/me')
.get(authController.protect, reviewController.setUserEmail, reviewController.getAllReviewsByMe)

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(authController.protect, authController.restrictTo('user', 'admin'),reviewController.deleteReview)
  .patch(authController.protect, authController.restrictTo('user', 'admin'), reviewController.updateReview)

module.exports = router;