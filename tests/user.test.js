const app = require('../src/app.js')
const request = require('supertest')
const user = require('../src/models/User.js')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const {fillingDb,userOne, userTwo} = require('./fixtures/db.js')

// const userOneId = new mongoose.Types.ObjectId()
// const userOne = {
//     _id: userOneId,
//     name: 'saawye',
//     email: 'rahulj2501@gmail.com',
//     password: 'jijsiqej',
//     tokens: [{
//         token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
//     }]
// }

// beforeEach(async()=>{
//     await user.deleteMany()
//     await new user(userOne).save()
//     // await new user(userTwo).save()
// })

beforeEach(fillingDb)

test('add user', async()=>{
    await request(app).post('/users').send({
        name: 'Akar',
        email: 'Akar@gmail.com',
        password: 'jhhuehwhcjnkjn'
    }).expect(201)
})

test('login user', async()=>{
    const response = await request(app).post('/users/login').send({
        email: 'rahulj2501@gmail.com',
        password: 'jijsiqej'
        }).expect(200)

    const userx = await user.findById(response.body.userData._id)
    expect(userx).not.toBeNull()

    // console.log(response.body)

    // expect(response.body.userData).toMatchObject({
    //     user: {
    //         name: 'saawye',
    //         email: 'rahulj2501@gmail.com',
    //     },
    //     token: userx.tokens[0].token
    // })
    // console.log(userx.tokens[0].token)
    // console.log(userOne.tokens[0].token)

    expect(userx.tokens[0].token).toBe(userOne.tokens[0].token)
})

test('login with wrong credidtials', async()=>{
    await request(app).get('/users/me').send({
        email: 'rsls',
        password: 'mdq'
        }).expect(401)
})

test('authanticate user', async()=>{
    await request(app).get('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('error if wrong token is provided', async()=>{
    await request(app).get('/users/me')
    .send()
    .expect(401)
})

test('deleting profile with proper autharization', async()=>{
    await request(app).delete('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const userx = await user.findById(userOne._id)
    expect(userx).toBeNull()
})

test('deleting profile with improper autharization', async()=>{
    await request(app).delete('/users/me')
    .send()
    .expect(401)
    console.log(__dirname)
})

test('uploding image', async()=>{
    await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg').expect(201)

    const userx = await user.findById(userOne._id)

    expect(userx.avatar).toEqual(expect.any(Buffer))
})

test('updating user profile with proper credidtials', async()=>{
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
        email: 'mimiojerryoo@gmail.com'
    }).expect(200)

    const userx = await user.findById(userTwo._id)
    expect(userx.email).toEqual('mimiojerryoo@gmail.com')
})

test('updating user profile with improper credidtials', async()=>{
    await request(app).patch('/users/me')
    .send({
        email: 'rahulcruze2501@gmail.com'
    }).expect(401)
})

