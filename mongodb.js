// const { MongoClient } = require("mongodb");

// const connectionURL = "mongodb://127.0.0.1:27017";
// const dbName = "task-manager";

// async function main() {
//     const client = await MongoClient.connect(connectionURL);
//     console.log("Connected successfully to server");
// }

// main().catch(console.error);
const mongodb = require('mongodb-legacy')

const mongodbClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectId

const databaseName = 'task-manager'
const connectionURL = 'mongodb://127.0.0.1:27017'



mongodbClient.connect(connectionURL,{useNewUrlParser: true},(error, client)=>{
    if(error){
        return console.log(error)
    }
    console.log('connected')

    // const db = client.db(databaseName)
    // db.collection('user').insertMany([{name: 'ajay', age:30}, {name: 'divya', age:23}], (error,result)=>{
    //     if (error){
    //         return console.log("Can't insert into db" )
    //     }
    //     console.log(result.insertedIds)
    // })

    // const db = client.db(databaseName)
    // db.collection('tasks').insertMany([{description:'completing homework', status:true}, {description:'checking mail', status:false},{description:'playing football',status:true}],(error,result)=>{
    //     if (error){
    //         return console.log("can't insert the values")
    //     }
    //     console.log(result.insertedIds)
    // })

    // const db = client.db(databaseName)
    // db.collection('tasks').findOne({_id: new ObjectId("6688f371bbb59b6dcb631075")}, (error,user)=>{
    //     if (error){
    //         return console.log("Can't fetch the data")
    //     }
    //     console.log(user)
    // })

    // db.collection('tasks').find({status: false}).toArray((error, result)=>{
    //     if (error){
    //         return console.log("Can't fetch data")
    //     }

    //     console.log(result)
    // })

    // db = client.db(databaseName)
    // db.collection('tasks').updateMany({status: false},
    // {
    //     $set : {
    //         status: true
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db = client.db(databaseName)

    // db.collection('user').deleteMany({age:23}).
    // then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({description:'playing football'})
    .then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})
