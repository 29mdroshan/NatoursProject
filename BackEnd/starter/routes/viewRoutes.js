const express = require('express');
const router = express.Router();
const viewController = require('./../Controllers/viewController.js');
const AppError = require('./../utils/AppError.js')

router.get('/', viewController.getOverview)
router.get('/tour/:slug', viewController.getTour)
router.get('/login', viewController.getLoginForm)

router.all('*', (req,res,next) =>{
    next(new AppError(`can't fine ${req.originalUrl} on this server`, 404));
})

module.exports = router