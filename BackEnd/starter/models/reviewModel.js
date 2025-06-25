const mongoose = require('mongoose');
const Tour = require('./tourModel');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema({
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'tours',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      //refernce should be same as the value used while saving model
      ref: 'user',
      required: [true, 'Review must belong to a user']
    },
    bookingId: {
      type: String,
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

reviewSchema.index({tour:1, user:1},{unique:true});

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name guides'  // select only required fields
        
    // })
    // .populate({
    //     path: 'user',
    //     select: 'name photo'  // select only required fields
        
    // });
    this.populate({
        path: 'user',
        select: 'name photo email'  // select only required fields
        
    });
    next();
})

reviewSchema.statics.calAverageRating = async function(tourId) {
  const stats =  await this.aggregate([
    {
      $match: {tour: tourId}
    }, 
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    }
  ])

  if(stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage:stats[0].averageRating,
      ratingQuality:stats[0].nRating
  
    })
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage:4.5,
      ratingQuality:0
  
    })
  }
}

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calAverageRating(this.tour);
})


reviewSchema.pre(/^findOneAnd/, async function(next) {
  // passing the data from pre to post middleware using this.r
  this.r = await this.findOne();
  // console.log(this.r);
  next();
})

reviewSchema.statics.findByUserEmail = async function(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  return this.find({ user: user._id })
             .populate('tour', 'name ratingsAverage') // populate tour details
};

reviewSchema.post(/^findOneAnd/, async function(next) {
  // accessing the data from pre middleware
  await this.r.constructor.calAverageRating(this.r.tour);
})


const Review = mongoose.model('review',reviewSchema);

module.exports = Review;