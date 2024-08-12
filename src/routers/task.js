const express = require('express')
const task = require('../models/Task.js')
const auth = require('../middleware/auth.js')



const router = new express.Router()

router.post('/tasks',auth,async(req,res)=>{
    const xask = new task({
        ...req.body,
        authur: req.user._id
    })

    try{
        const newTask = await xask.save()
        res.send(newTask).status(201)
    }catch(error){
        res.send(error).status(400)
    }
    // xask.save().
    // then((result)=>{
    //     console.log(result)
    //     res.send(result).status(201)
    // }).
    // catch((error)=>{
    //     console.log(error)
    //     res.send(error).status(400)
    // })
})

// tasks?status=false&limit=2&skip=0&sortBy=bywhatyouwhattosort:asc or desc
router.get('/tasks', auth, async(req,res)=>{

    const match = {};
    const sort = {};

    if (req.query.status){
        match.status = req.query.status === 'true'
    }

    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1:1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
            }
        })
        res.send(req.user.tasks)
    }catch(error){
        res.send(error).status(404)
    }
    // task.find({}).
    // then((result)=>{
    //     if (!result){
    //         return res.send().status(404)
    //     }
    //     res.send(result).status(200)
    // }).
    // catch((error)=>{
    //     res.send(error).status(404)
    // })
})

router.get('/tasks/:id',auth, async(req,res)=>{
    const _id = req.params.id

    try{

        const userTask = await task.findOne({_id, authur:req.user._id})
        console.log(userTask)
        if(!userTask){
            return res.send().status(404)

        }

        res.send(userTask).status(200)
    }catch(error){

        res.send(error).status(404)
    }
    // console.log(_id)
    // task.findById(_id).
    // then((result)=>{
    //     if (!result){
    //         return res.send().status(404)
    //     }
    //     res.send(result).status(200)
    // }).
    // catch((error)=>{
    //     res.send(error).status(404)
    // })
})

router.delete('/tasks/:id',auth,async(req,res)=>{

    try{

        const delTask = await task.findOneAndDelete({_id:req.params.id,authur:req.user._id})

        if (!delTask){
            return res.send('Task not found!!').status(404)
        }

        res.send(delTask).status(200)

    }catch(error){
        res.send(error).status(500)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const allowedUpdates = ["description", "status"]
    const reqUpdates = Object.keys(req.body)
    const _id = req.params.id
    const isValid = reqUpdates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if (!isValid){
        return res.send('invalid updates').status(404)
    }

    try{
        // const updatedData = await task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidation: true})

        const reqTask = task.findOne({_id, authur:req.user._id})

        if(!reqTask){
            return res.send().status(404)
        }

        reqUpdates.forEach((update)=>{
            reqTask[update] = req.body[update]
        })

        const updatedData = await reqTask.save()

        if(!updatedData){
            return res.send().status(404)
        }

        res.send(updatedData).status(200)
    }catch(error){
        res.send(error).status(500)
    }
})

module.exports = router
