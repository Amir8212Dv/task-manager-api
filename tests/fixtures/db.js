const request = require('supertest')
const  app  = require('../../src/app')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {User} = require('../../src/models/user')
const {Task} = require('../../src/models/tasks')

const _id = new mongoose.Types.ObjectId()
const _id2 = new mongoose.Types.ObjectId()
const token = jwt.sign({_id} , process.env.JWT_SECRETE)
const token2 = jwt.sign({_id : _id2} , process.env.JWT_SECRETE)


const user = {
    _id ,
    name : 'amir',
    age : 20,
    email : 'amir@example.com',
    password : 'abcdefg123',
    tokens: [
        {token}
    ]
}


const user2 = {
    _id : _id2,
    name : 'ali',
    age : 20,
    email : 'ali@example.com',
    password : 'abcdefg123',
    tokens: [
        {token : token2}
    ]
}

const task1 = {
    _id : new mongoose.Types.ObjectId(),
    task : 'task 1',
    owner : user

}

const task2 = {
    task : 'task 1',
    owner : user2
}

const task3 = {
    task : 'task 1',
    owner : user2
}

const task4 = {
    task : 'task 1',
    owner : user2
}
const userHandler = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await request(app).post('/users/signup').send(user)
    await request(app).post('/users/signup').send(user2)
    await request(app).post('/tasks').set('Authorization' , token).send(task1)
    await request(app).post('/tasks').set('Authorization' , token).send(task2)
    await request(app).post('/tasks').set('Authorization' , token2).send(task3)
    await request(app).post('/tasks').set('Authorization' , token2).send(task4)
    // await new Task(task1)
    // await new Task(task2)
    // await new Task(task3)
    // await new Task(task4)
}
module.exports = {
    task1,
    user,
    user2,
    token2,
    token,
    userHandler
}
