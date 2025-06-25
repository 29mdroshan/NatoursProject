const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Booking must have a user name.']
    },
    userEmail: {
        type: String,
        required: [true, 'Booking must have a user email.']
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    startDate: {
        type: Date,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: [true, 'Booking must have a total price.'],
    },
    status: {
        type: String,
        enum: ['confirmed', 'canceled'],
        default: 'confirmed'
    }, 
    isUserReviewed: {
        type: Boolean,
        default: false
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'tours',
        required: [true, 'Booking must belong to a tour.']
    }
});

bookingSchema.statics.findByUserEmail = async function(email) {
    return this.find({ userEmail: email }).populate('tour');
};

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking;