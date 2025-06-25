// const fs = require('fs');
// tours = JSON.parse(
//     fs.readFileSync('./dev-data/data/tours-simple.json')
// )

// exports.checkId = (req, res, next, value) => {
//     const id = value * 1;
//     const tour = tours.find( i => i.id === id)

//     if(!tour) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'No tour found with ID'
//         });
//     }
//     next();;
// }

// exports.checkBody = (req, res, next) => {
//     console.log(req.body)
//     console.log("executed")
//     if(!req.body.name || !req.body.price) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         });
//     }
//     next();;
// }

// exports.getAllTours = (req, res) => {
//     res.status(200).json({
//         status:'success',
//         results: tours.length,
//         data : {
//             tours: tours
//         }
//     })
// }

// exports.getTour = (req, res) => {
//     const id = req.params.id * 1;
//     const tour = tours.find( i => i.id === id)
//     res.status(200).json({
//         status:'success',
//         results: tours.length,
//         data : {
//             tours: tour
//         }
//     })
// }

// exports.createTour = (req, res) => {
//     const newId = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({id: newId}, req.body);
//     tours.push(newTour);
//     fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), (err) =>{
//        res.status(201).json({
//         status:'success',
//         data: {
//             tour: newTour
//         }
//        })
//     })
// }

// exports.updateTour = (req, res) => {
//     const id = req.params.id * 1;
//     const tour = tours.find( i => i.id === id)
//     res.status(200).json({
//         status:'success',
//         data : {
//             tours: tour
//         }
//     })
   
// }

// exports.deleteTour = (req, res) => {
//     res.status(204).json({
//         status:'success',
//         data : null
//     })
   
// }

const Tour = require('./../models/tourModel.js')
const APIFeatures = require('./../utils/apiFeatures.js')
const CatchAsyn = require('./../utils/CatchAsyn.js')
const AppError = require('./../utils/AppError.js')
const factory = require('./handlerFactory.js')

exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '4';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,description';
    next();
}

// const catchAsync = fn => {
//     return (req,res,next) => {
//         fn(req,res,next).cath(err => next(err))
//     }
// }


// Catch asyn can be add to other function as well. Don't forget to add next
// exports.createTour = CatchAsyn(async (req, res, next) => {
//     // try {
//     //     const newTour = await Tour.create(req.body);

//     //     res.status(201).json({
//     //         status:'success',
//     //         data: {
//     //             tour: newTour
//     //         }
//     //        });
//     // } catch (err) {
//     // res.status(400).json({
//     //     status: 'fail',
//     //     message: err
//     // });
//     // }
//     const newTour = await Tour.create(req.body);

//         res.status(201).json({
//             status:'success',
//             data: {
//                 tour: newTour
//             }
//            });
   
// })
exports.createTour = factory.createOne(Tour);

exports.getAllTours = factory.getAll(Tour);

// exports.getAllTours = async(req, res) => {
//     try{
//         // // Build the query string
//         // //1A) Filtering
//         // const queryObj =  {...req.query}
//         // const excludedFields = ['page','sort', 'limit', 'fields']
//         // excludedFields.forEach(i => delete queryObj[i]);

//         // // 1B) Advance Filtering
//         // let queryStr = JSON.stringify(queryObj);
//         // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//         // Construct the query
//         // let query =  Tour.find(JSON.parse(queryStr));

//          // 2) Sorting
//         //  if(req.query.sort) {
//         //     const sortBy = req.query.sort.split(',').join(' ')
//         //     console.log(sortBy)
//         //     query = query.sort(sortBy)
//         //  } else {
//         //     query = query.sort('-createdAt')
//         // }

//         // 3) fields
//         // if(req.query.fields) {
//         //     const fields = req.query.fields.split(',').join(' ')
//         //     console.log(fields)
//         //     query = query.select(fields)
//         //  } 

//         // 4) pagination
//         // if(req.query.page) {
//         //     const page = req.query.page * 1 || 1
//         //     const limit = req.query.limit * 1 || 10
//         //     const skip = (page - 1) * limit
            
//         //     console.log(page, limit, skip)
//         //     query = query.skip(skip).limit(limit)
//         // }
//         // if(req.query.page && req.query.limit) {
//         //     query = query.skip(req.query.page*req.query.limit*1).limit(req.query.limit)
//         // }
 

//         // Execute the query
//         const features = new APIFeatures(Tour.find(), req.query)
//                         .filter()
//                         .sort()
//                         .fields()
//                         .pagination();
//         const tours = await features.query;

//         // Send the response
//         res.status(200).json({
//             status:'success',
//             results: tours.length,
//             data : {
//                 tours: tours
//             }
//         })
//     }
//     catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }

// exports.getTour =  async (req, res) => {
//     try{
//         // populate decrease the performance
//         const tour = await Tour.findById(req.params.id).populate({
//             path:'reviews',
//             select: 'user rating review -tour'
//         });
//         if(!tour) {
//             return next(new AppError("No tour found with that id", 404));
//         }
//         res.status(200).json({
//             status:'success',
//             data : {
//                 tours: tour
//             }
//         })
//     }
//     catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }

exports.getTour = factory.getOne(Tour, {
    path:'reviews',
    select: 'user rating review -tour'
})


// exports.updateTour = factory.updateOne(Tour);
exports.updateTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status:'success',
            data : {
                tours: tour
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
   
}

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = async (req, res) => {
//     try{
//         await Tour.findByIdAndDelete(req.params.id);
//         res.status(200).json({
//             status:'success',
//             message: 'Succesfully deleted the requested'
//         })
//     }
//     catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
   
// }

exports.getTourStats = async (req, res) => {
    try{
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: {
                        $toUpper: '$difficulty'
                    },
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {avgPrice: 1}
            }
        ]);
        res.status(200).json({
            status:'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.monthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },{
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                       
                    }
                }
            },{
                $group: {
                    _id: {
                        $month: '$startDates'
                    },
                    numTourStarts: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },{
                $addFields:{month: '$_id'}
            },{
                $project: {
                    _id: 0
                }
            },
            {
                $sort:{numTourStarts: -1}
            }
            
        ]);
        res.status(200).json({
            status:'success',
            data: {
                plan
            }
        });

    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}


exports.getToursWithin = CatchAsyn(async (req, res, next) =>{
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if(!lat || !lng) return next(new AppError('Please provide latitude and longitude in the format lat,lng', 400))

    const radius = unit ==='mi'? distance / 3963.2 : distance / 6378.1; // 3963.2 for miles, 6378.1 for kilometers

    const tours = await Tour.find({startLocation:{$geoWithin:{ $centerSphere:[[lng,lat], radius]}}});
    res.status(200).json({
        status:'success',
        results: tours.length,
        data: {
            data: tours
        }
    })
})