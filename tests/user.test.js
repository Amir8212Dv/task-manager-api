const request = require('supertest')
const  app  = require('../src/app')
const {User} = require('../src/models/user')
const {user , token , userHandler} = require('./fixtures/db')

beforeEach(userHandler)


test('* SignUp *' , async () => {
    const response = await request(app).post('/users/signup').send({
        name : 'test',
        age : 20,
        email : 'test@example.com',
        password : 'testtest'
    }).expect(201)

    const userObject = await User.findById(response.body.user._id)
    expect(userObject).not.toBeNull()

    expect(response.body.user).toMatchObject({
        name : userObject.name ,
        age : userObject.age ,
        email : userObject.email ,
        _id : userObject._id
    })
    expect(userObject.password).not.toBe(user.password)
})

test('* Login *' , async () => {
    const response = await request(app).post('/users/login').send({
        email : user.email,
        password : 'abcdefg123'

    }).expect(200)

    const userObject = User.findById(response.body.user._id)
    expect(userObject).not.toBeNull()
    // expect()

})

test('* Get/me *' , async () => {
    await request(app).get('/users/me')
    .set('Authorization' , token)
    .send()
    .expect(200)
})

test('* Fail Get *' , async () => {
    await request(app).get('/users/me')
    .send()
    .expect(401)
})

test('* Logout *' , async () => {
    await request(app).post('/users/logout')
    .set('Authorization' , token)
    .send()
    .expect(200)
})

test('* Logout ALL *' , async () => {
    await request(app).post('/users/logoutAll')
    .set('Authorization' , token)
    .send()
    .expect(200) 

    const userObject = User.findById(user._id)
    console.log(userObject)
    expect(userObject.token).toBe()
})

test('* Update *' , async () => {
    await request(app).patch('/users/me')
    .set('Authorization' , token)
    .send({name : 'mohammad'})
    .expect(201)

    const userObject = User.findById(user._id)
    expect(userObject.name).not.toBe(user.name)
})

test('* Delete *' , async () => {
    const response = await request(app).delete('/users/me')
    .set('Authorization' , token)
    .expect(200)

    const userObject = await User.findById(user._id)
    expect(userObject).toBeNull()
})

test('* Upload/Get/Delete Avatar *' , async () => {
    await request(app).post('/users/me/avatar')
    .set('Authorization' , token)
    .attach('avatar' , 'tests/fixtures/profile.jpg')
    .expect(200)

    await request(app).get('/users/me/avatar')
    .set('Authorization' , token)
    .expect(200)

    await request(app).delete('/users/me/avatar')
    .set('Authorization' , token)
    .expect(200)
})
