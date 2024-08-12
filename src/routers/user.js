const express = require('express')
const user = require('../models/User.js')
const auth = require('../middleware/auth.js')
const multer = require('multer')
const sharp = require('sharp')
const welcomeMail = require('../emails/account.js')

const router = new express.Router()

router.post('/users',async(req,res)=>{
    console.log(req.body.email)
    const mailOptions = {
      from: 'rahulj2501@gmail.com',
      to: `${req.body.email}`,
      subject: 'Sending Email using Node.js',
      text: `Hi!! ${req.body.name} thankyou for choosing us`
    };
    welcomeMail.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    const xser = new user(req.body)
    try{
        const newData = await xser.save()
        const token = await xser.generateAuthTokens()
        res.status(201).send({newData,token})
    }catch(error){
        res.status(400).send(error)
    }


    // xser.save().
    // then((result)=>{
    //     // console.log(result)
    //     res.send(result).status(201)
    // }).
    // catch((error)=>{
    //     // console.log(error)
    //     res.status(400).send(error)
    // })
    // console.log('connected!!')
    // res.send('conected!!')
})

router.get('/users/me', auth,async(req,res)=>{

    res.send(req.user)

    // try{
    //     const users = await user.find({})
    //     if(!users){
    //         return res.send().status(404)
    //     }
    //     res.send(users).status(200)
    // }catch(error){
    //     res.send(error).status(500)
    // }


    // user.find({}).
    // then((result)=>{
    //     if (!result){
    //         return res.send().status(404)
    //     }
    //     res.send(result).status(200)
    // }).
    // catch((error)=>{
    //     res.send(error).status(500)
    // })
})

router.post('/users/logout', auth, async(req,res)=>{
    try{
        const usedToken = req.token
        const user = req.user
        user.tokens = user.tokens.filter((token)=>{
            return token.token !== usedToken
        })
        await user.save()
        res.send()
    }catch(error){
        res.send(error).status(500)
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        const user = req.user
        user.tokens = []
        await user.save()
        res.send()
    }catch(error){
        res.send(error).status(500)
    }
})

router.patch('/users/me',auth,async(req,res)=>{
    const reqUpdates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = reqUpdates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValid){
        return res.send('invalid updates').status(404)
    }

    try{
        // const updatedData = await user.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidation: true})

        // const reqUser = await user.findById(req.params.id)

        // if(!reqUser){
        //     return res.send().status(404)
        // }

        const reqUser = req.user

        reqUpdates.forEach((update)=>{
            reqUser[update] = req.body[update]
        })
        if(!reqUpdates){
            return res.send().status(404)
        }
        const updatedData = await reqUser.save()
        res.send(updatedData).status(200)
    }catch(error){
        res.send(error).status(500)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try{
        const mailOptions = {
          from: 'rahulj2501@gmail.com',
          to: `${req.body.email}`,
          subject: 'Sending Email using Node.js',
          text: `Hi!! ${req.body.name} what was the issue you were facing with us, if so please tell us so we can improve`
        };
        welcomeMail.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        await req.user.delete
        res.send(req.user)
    }catch(error){
        res.send(error).status(500)
    }
})

router.post('/users/login',auth,async(req,res)=>{
    try{
        console.log(req.body.email, req.body.password)
        const userData = await user.findByCrenditials(req.body.email, req.body.password)
        const token = userData.generateAuthTokens()
        res.send({userData,token}).status(200)
    }catch(error){
        res.send(error).status(404)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,callback){
        // if (!file.orginalname.endsWith('.pdf')){
        //     return callback(new Error('Upload only pdf'))
        // }
        // if (!file.orginalname.match(/\.(doc|docx)$/)){
        //     return callback(new Error('Upload only Word!!'))
        // }

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('upload only images!!'))
        }

        callback(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send().status(201)
},(error,req,res,next)=>{
    res.send({error:error.message}).status(400)
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send().status(200)
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const userx = await user.findById(req.params.id)

        if(!userx||!userx.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(userx.avatar)
    }catch(error){
        res.send().status(404)
    }
})


module.exports = router
