const express = require('express')
const app = express()
const userRouter = require('./Router/users')
const tasksRouter = require('./Router/tasks')


app.use(express.json())
app.use(userRouter) 
app.use(tasksRouter)

app.listen(process.env.PORT , () => console.log(process.env.PORT))
