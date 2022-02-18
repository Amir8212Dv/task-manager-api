const request = require('supertest')
const  app  = require('../src/app')
const {Task} = require('../src/models/tasks')
const {task1 , user , user2 , token2 , token , userHandler} = require('./fixtures/db')

beforeEach(userHandler)

test('* Create Task *' , async () => {
    const response = await request(app).post('/tasks')
    .set('Authorization' , token)
    .send({task : 'a'})
    .expect(201)
    
    const userObject = await Task.findById(response.body._id)
    expect(userObject).not.toBeNull()
})

test('* Users Tasks *' , async () => {
    const response = await request(app).get('/tasks').set('Authorization' , token).expect(200)
    expect(response.body[0].owner).toBe(user._id.toString())
    expect(response.body.length).toBe(2)
    
})

test('* Users Tasks *' , async () => {
    const response = await request(app).get('/tasks').set('Authorization' , token2).expect(200)
    expect(response.body[0].owner).toBe(user2._id.toString())
    expect(response.body.length).toBe(2)
})

test('* not Allowed User *' , async () => {
    await request(app).delete(`/tasks/${task1._id}`)
    .set('Authorization' , token2)
    .expect(500)

    const userObject = await Task.findById(task1._id)
    expect(userObject).not.toBeNull()

})
