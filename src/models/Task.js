const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const taskSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
    },
    authur: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }
},{
    timestamps: true
})


taskSchema.pre('save', async function(next){
    const task = this

    if(task.isModified('password')){
        task.password = await bcrypt.hash(task.password,8)
    }
    next()
})

const Task = mongoose.model('Tasks',taskSchema)
module.exports = Task;
