const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL)


// user = new User({
//     name: 'rahul',
//     age: 21,
//     email: 'rahul@gmail.com',
//     password: 'dddks'
// })

// user.save().
// then((result)=>{
//     console.log(result)
// }).
// catch((error)=>{
//     console.log(error)
// })



// task = new Tasks({
//     description: 'clean your home',

// })

// task.save().
// then((result)=>{
//     console.log(result)
// }).
// catch((error)=>{
//     console.log(error)
// })
