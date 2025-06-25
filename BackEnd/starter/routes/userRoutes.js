const express = require('express');
const router = express.Router();
const userController = require('./../Controllers/userController.js')
const authController = require('./../Controllers/userAuthContoller.js')


router
  .route('/signup')
  .post(authController.signup)

router
  .route('/login')
  .post(authController.login)

router
  .route('/logout')
  .get(authController.logout)

router
  .route('/forgotPassword')
  .post(authController.forgotPassword)

router
  .route('/resetPassword/:token')
  .patch(authController.resetPassword)

router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword)

router
  .patch('/updateMe',authController.protect, userController.uploadUserPhoto, userController.updateMe)

router
  .delete('/deleteMe',authController.protect, userController.deleteMe)

router.get('/me', authController.protect, userController.getMe, userController.getUser);

router.use(authController.protect)

router
  .route('/')
  .get(authController.restrictTo('admin'),userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = router;