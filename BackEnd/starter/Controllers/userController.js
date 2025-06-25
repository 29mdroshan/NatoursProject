const User = require('./../models/userModel.js')
const catchAsyn = require('./../utils/CatchAsyn.js')
const AppError = require('./../utils/AppError.js')
const factory = require('./handlerFactory.js')
const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/home/mohammeda/Personal/FrontEndTech/Angular/Natours/src/assets/img/users');
  },
  filename: (req, file, cb) => {    
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
})

// keep the images in memory
// const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10000000 // 1MB
  } 
});

exports.uploadUserPhoto = upload.single('photo');

// exports.resizeUserPhoto =  (req, res, next) => {
//   if(!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   sharp(req.file.buffer)
//   .resize(500, 500)
//   .toFormat('jpeg')
//   .jpeg({quality:90})
//   .toFile(`/home/mohammeda/Personal/FrontEndTech/Angular/Natours/src/assets/img/users/custom/${req.file.filename}`);

//   next();
// }


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
}

exports.getAllUsers = catchAsyn(async(req, res) => {
  const users = await User.find()
  res.status(200).json({
      status: 'Sucess',
      data: {
        users
      }
    });
  });

exports.updateMe = catchAsyn(async(req,res,next) => {
  console.log(req.body);
  console.log(req.file);
  // 1) create a error if user post password
  if(req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This routes is not for password updates. Please use updatePassword', 400));
  }

  let user = await User.findById(req.user.id);
  if(!user || user.active === false) {
    return next(new AppError('No user found with this ID', 404));
  }

  // filter only allowed user
  const filteredBody = filterObj(req.body, 'name','email');
  if(req.file) {
    filteredBody.photo = req.file.filename;
    user.photo = req.file.filename;
  }
  if(filteredBody.email) {
    user.email = filteredBody.email;
  }
  if(filteredBody.name) {
    user.name = filteredBody.name;
  }
  // 2) update the user document
  await User.findByIdAndUpdate(req.user.id, filteredBody);

  res.status(200).json({
    status:'success',
    data: {
      user
    }
  })
})

// use factory function , if needed
exports.deleteMe = catchAsyn(async(req,res,next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status:'success',
    data: null
  })
})

exports.getUser = factory.getOne(User)

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!. Please use syn up instead'
    });
  };

exports.updateUser = factory.updateOne(User);

exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
       message: 'This route is not yet defined!. Please try again'
    });
  };




