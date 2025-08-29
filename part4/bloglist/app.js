const express = require('express')
const logger = require('./utils/logger')
const app = express()
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.handleJsonErrors)


app.use('/api/blogs',  blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.get('/',(request, response) => {
    response.send('<h1>Welcome to Blog List</h1>')
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app