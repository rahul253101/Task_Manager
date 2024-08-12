const jwt = require('jsonwebtoken')
const userx = require('../models/User.js')

const auth = async(req,res,next)=>{

    try{
        const token =  req.header('Authorization').replace('Bearer ','')
        const decoded =  jwt.verify(token,process.env.JWT_SECRET)
        const user = await userx.findOne({_id :decoded._id, 'tokens.token':token})
        if(!user){

            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    }catch(error){
        res.send('error: please authenticate!!').status(401)
    }


}

module.exports = auth
