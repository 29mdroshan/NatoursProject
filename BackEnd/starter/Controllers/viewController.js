const Tour = require('../models/tourModel.js')
const catchAsync = require('../utils/CatchAsyn.js')

exports.getOverview = catchAsync(async(req,res) => {
    // 1) Get Tour data from collection
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title:'All tour',
        tours: tours
    })
})

exports.getTour = catchAsync(async(req,res,next) => {
   
    const tour = await Tour.findOne({name: req.params.slug}).populate(
        {
            path:'reviews',
            fields: 'review rating user'
        }
    )
    res.status(200).render('tour', {
        title: tour.name,
        tour
    })
})

exports.getLoginForm = (req,res) => {
    res.status(200).res.render('login', {title: 'Login'})
}