
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path:'./config.env'})
const app = require('./app.js');


// console.log(process.env)
const DB = process.env.DATABASE

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});