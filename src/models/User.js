const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const task = require('./Task.js')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    age: {
        type: Number,
        default: 0,
        validate: (value)=>{
            if (value<0){
                throw new Error('Age can not be negative!!')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: (value)=>{
            if (!validator.isEmail(value)){
                throw new Error('Enter a valid Email!!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate: (value)=>{
            if (value.toLowerCase().includes('password')){
                throw new Error('try another password!! ')
            }
        }

    },
    avatar:{
        type: Buffer
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref:task,
    localField:'_id',
    foreignField: 'authur'
})

userSchema.methods.generateAuthTokens = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'mynodeproject')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCrenditials = async(email, password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('invalid email!!')
    }
    console.log(1122)
    console.log(password,user.email)
    const truePassword = bcrypt.compare(password,user.password)

    if(!truePassword){
        throw new Error('invalid login!!')
    }

    return user
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.pre('save', async function(next){
    const user = this

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await task.deleteMany({authur:user._id})
    next()
})

const User = mongoose.model('User',userSchema)
User.createIndexes();

module.exports = User;
