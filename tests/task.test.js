const task = require('../src/models/Task.js')
const app = require('../src/app.js')
const request = require('supertest')
const {fillingDb, userOne, taskThree,userTwo, taskOne} = require('./fixtures/db.js')

beforeEach(fillingDb)

test('to craete a task for a authorized user', async()=>{
    const response = await request(app).post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: "take a walk"
    }).expect(201)
    console.log(response.body)
    const taskx = await task.findById(response.body._id)
    expect(taskx).not.toBeNull()
    expect(taskx.status).toEqual(false)
})

test('to craete a task for a unauthorized user', async()=>{
    const response = await request(app).post('/tasks')
    .send({
        description: "take a shit"
    }).expect(401)
})

test('to get all tasks for a authorized user', async()=>{
    const response = await request(app).get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

    expect(response.body.length).toEqual(2)
})

test('to get all tasks for a unauthorized user', async()=>{
    const response = await request(app).get('/tasks')
    .expect(401)
})


test('updating task by unauthorized user', async()=>{
    await request(app).patch(`/tasks/${taskThree._id}`).send({
        status: true
    }).expect(401)
})

test('updating task by authorized user', async()=>{
    const response = await request(app).patch(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
        status: true
    }).expect(200)

    console.log(response.body)
})

test('deleting a task by authorized user', async()=>{
    const response = await request(app).delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(200)

    console.log(response.body)
})

test('deleting a task by unauthorized user', async()=>{
    await request(app).delete(`/tasks/${taskOne._id}`)
    .expect(401)
})
