require('./db/mongoose.js')


const express = require('express')
const user = require('./models/User.js')
const task = require('./models/Task.js')
const userRoutes = require('./routers/user.js')
const taskRoutes = require('./routers/task.js')

const app = express()
app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)


const port = process.env.PORT

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})

