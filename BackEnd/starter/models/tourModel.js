const mongoose = require('mongoose');
// const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name : {
        type: String,
        required: ['name', 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [3, 'A tour name must have more or equal then 3 characters']
        // validate: validator.isAlpha
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy','medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsAverage: {
        type: Number,
        default: 4.0,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingQuality: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate : {
            // this only points to currect doc on new document creation
            validator: function(val) {
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summery']
    },
    description:{
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    startLocation:{
        // GeoJson
        type:{
            type : String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address:String,
        description: String
    },
    locations:[
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'user'
        }
      ]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

tourSchema.index({price:1})
tourSchema.index({startLocation: '2dsphere'})
tourSchema.index({ name: 1 });

// properties will not be save in database
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

//Virtually populate the revieew on tours
//Virtuall populate
tourSchema.virtual('reviews', {
    ref:'review',
    // tour field name that is stored on review model
    foreignField: 'tour',
    localField: '_id'
})


//Executed before .save() and .create()
tourSchema.pre('save', function(next) {
    console.log("Will save document....");
    next();
    })

tourSchema.pre(/^find/, function(next) {
        this.populate({
            path: 'guides' ,
            select:'-__v'  
        })
        next();
    })

tourSchema.post('save', function() {
        console.log("Will save document....");
        })

const Tour = mongoose.model('tours', tourSchema)

module.exports = Tour