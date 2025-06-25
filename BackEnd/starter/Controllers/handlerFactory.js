const AppError = require('../utils/AppError.js')
const CatchAsyn = require('../utils/CatchAsyn.js')
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => CatchAsyn(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
     if(!doc) {
      return next(new AppError('No document found', 404));
    }
    if(doc.user && doc.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError("You are not authorized to delete this document", 403));
    }
    await Model.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status:'success',
        message: 'Succesfully deleted the requested'
    })
        
});

exports.updateOne = Model => CatchAsyn(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if(!doc) {
      return next(new AppError('No document found', 404));
    }

    if(doc.user && doc.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError("You are not authorized to update", 403));
    }
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status:'success',
        data : {
            data: updatedDoc
        }
    })
})

exports.createOne = Model =>
    CatchAsyn(async (req, res, next) => {
      const doc = await Model.create(req.body);
  
      res.status(201).json({
        status: 'success',
        data: {
          data: doc
        }
      });
}); 


exports.getOne = (Model, popOptions) =>
    CatchAsyn(async (req, res, next) => {
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      const doc = await query;
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      });
});


exports.getAll = Model =>
    CatchAsyn(async (req, res, next) => {
      // To allow for nested GET reviews on tour (hack)
      let filter = {};
      if (req.params.tourId) filter = { tour: req.params.tourId };
  
      const features = new APIFeatures(Model.find(filter), req.query)
                        .filter()
                        .sort()
                        .fields()
                        .pagination();
      
      // const doc = await features.query.explain();
      const doc = await features.query;
  
      // SEND RESPONSE
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc
        }
      });
    });
  