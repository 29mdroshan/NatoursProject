const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser')

const AppError = require('./utils/AppError.js')
const globalErrorHandler = require('./Controllers/errorController.js')

const tourRouter = require('./routes/tourRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const reviewRouter = require('./routes/reviewRoutes.js')
const bookingRouter = require('./routes/bookingRoutes.js')
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
  
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

// Global middlewares

// set security http headers
app.use(helmet());

// limit request from same api
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again in a hour!'
});
app.use('/api',limiter);

//development logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Body parser, reading data from body into req.body
// Inbuilt MiddleWare
// to limit the json file size
app.use(express.json({ limit :'10kb'}))

app.use(cookieParser())

// Data sanitization against Nosql query injection
// I have regex to email, will also solves this problem
app.use(mongoSanitize())

// Data sanitization against xss
app.use(xss())

// prevent parameter pollution
app.use(hpp({
    whitelist: ['duration','price','difficulty','maxGroupSize','ratingQuality','ratingsAverage']
}))

// Serving static files 
app.use(express.static('./public'))

// Middele ware functions
// test middleware(only for testing purposes)
app.use((req,res, next) =>{
    console.log('Hello from the middleware 👋');
    next();
})

// test middleware
app.use((req, res, next) =>{
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
})

// Routers


// app.use('/', viewRouter)
app.use('/api/v1/tour', tourRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

// Create error for not develop routes
app.all('*', (req,res,next) =>{
    next(new AppError(`can't fine ${req.originalUrl} on this server`, 404));
})

// golbal error handler
app.use(globalErrorHandler)

module.exports = app;



//Filesystem functions
// const tours = JSON.parse(
//     fs.readFileSync('./dev-data/data/tours-simple.json')
// )

//RouteHandlers
// const getAllTours = (req, res) => {
//     res.status(200).json({
//         status:'success',
//         results: tours.length,
//         data : {
//             tours: tours
//         }
//     })
// }

// const getTour = (req, res) => {

//     const id = req.params.id * 1;
//     const tour = tours.find( i => i.id === id)

//     if(!tour){
//         return res.status(404).json({
//             status: 'fail',
//             message: 'No tour found with that ID'
//         })
//     }
//     console.log(tour, req.params)
//     res.status(200).json({
//         status:'success',
//         results: tours.length,
//         data : {
//             tours: tour
//         }
//     })
// }

// const createTour = (req, res) => {
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

// const updateTour = (req, res) => {
//     const id = req.params.id * 1;
//     const tour = tours.find( i => i.id === id)

//     if(!tour){
//         return res.status(404).json({
//             status: 'fail',
//             message: 'No tour found with that ID'
//         })
//     }

//     console.log(req.body);

//     res.status(200).json({
//         status:'success',
//         data : {
//             tours: tour
//         }
//     })
   
// }

// const deleteTour = (req, res) => {
//     const id = req.params.id * 1;
//     const tour = tours.find( i => i.id === id)

//     if(!tour){
//         return res.status(404).json({
//             status: 'fail',
//             message: 'No tour found with that ID'
//         })
//     }

//     console.log(req.body);

//     res.status(204).json({
//         status:'success',
//         data : null
//     })
   
// }

// app.get('/api/v1/tour', getAllTours)
// app.get('/api/v1/tour/:id', getTour)
// app.post('/api/v1/tour', createTour);
// app.patch('/api/v1/tour/:id', updateTour);
// app.delete('/api/v1/tour/:id', deleteTour);

// const tourRouter  =  express.Router();


// tourRouter.route('/')
//    .get(getAllTours)
//    .post(createTour);

// tourRouter.route('/:id')
//    .get(getTour)
//    .patch(updateTour)
//    .delete(deleteTour);

//    app.use('/api/v1/tour', tourRouter)

// app.use('/api/v1/tour', tourRouter)
// app.use('/api/v1/user', userRouter)

// app.all('*', (req,res,next) =>{
//     // res.status(404).json({
//     //     status: 'fail',
//     //     message: `Can't find ${req.originalUrl} on this server`
//     // })

//     // const err = new Error(`Can't find ${req.originalUrl} on this server`);
//     // err.status = 'fail';
//     // err.statusCode = 404;

//     next(new AppError(`can't fine ${req.originalUrl} on this server`, 404));
// })

// app.use(globalErrorHandler)

// module.exports = app;
// const port = 3000;
// app.listen(port, () => {
//     console.log(`listening on port {port}`)
// });