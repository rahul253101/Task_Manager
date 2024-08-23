const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const user = require('../../src/models/User.js')
const task = require('../../src/models/Task.js')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'saawye',
    email: 'rahulj2501@gmail.com',
    password: 'jijsiqej',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'vinyi',
    email: 'rahulcruze2501@gmail.com',
    password: 'jdjqhkjeqioj',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "watch Got",
    completed: true,
    authur: userTwo._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "eat",
    authur: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "wash dishes",
    authur: userTwo._id
}


const fillingDb = async()=>{

    await user.deleteMany()
    await task.deleteMany()
    await new user(userOne).save()
    await new user(userTwo).save()
    await new task(taskOne).save()
    await new task(taskTwo).save()
    await new task(taskThree).save()

}

module.exports = {
    fillingDb,
    userOne,
    userTwo,
    taskThree,
    taskOne
}
