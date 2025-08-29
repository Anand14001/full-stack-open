const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')


userRouter.get('/', async(request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

userRouter.post('/', async (request, response) => {
  try {
    const { username, name, password } = request.body

    if (!username) {
      return response.status(400).json({ error: 'Username is required' })
    }

    if (username.length < 3) {
      return response.status(400).json({ error: 'Username must be at least 3 characters long' })
    }

    if (!password) {
      return response.status(400).json({ error: 'Password is required' })
    }

    if (password.length < 3) {
      return response.status(400).json({ error: 'Password must be at least 3 characters long' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      response.status(400).json({ error: 'expected `username` to be unique' })
    } else {
      response.status(500).json({ error: 'Internal server error' })
    }
  }
})

module.exports = userRouter