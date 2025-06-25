const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../models/tourModel.js');
const User = require('./../models/userModel.js');
const Review = require('./../models/reviewModel.js');

dotenv.config({path:'./../config.env'})

mongoose.connect("mongodb+srv://user:Password@sandbox1.kb3t7hl.mongodb.net/natours2", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(
    con => {
        console.log('DB connection successful!')
    }
)

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`,'utf-8'));
const user = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`,'utf-8'));
const review = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`,'utf-8'));

const importData = async (req, res) => {
    try {
        const newTour = await Tour.create(tours);
        // make password confirm as false
        const newUser = await User.create(user);
        const newReview = await Review.create(review);

        console.log("data imported successfully")
    } catch (err) {
        console.log(err);
    }
}

const deleteData = async (req, res) => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("data deleted successfully")
    }
    catch (err) {
       console.log(err);
    }
}

console.log(process.argv)

if(process.argv[2] === '--importData') {
    importData();
} else if(process.argv[2] === '--deleteData') {
    deleteData();
}