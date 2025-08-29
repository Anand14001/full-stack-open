const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Users = require('../models/user')
const api = supertest(app)
const helpers = require('./test_helpers')
const bcrypt = require('bcrypt')


describe('when there is initially one user in db', () => {
    beforeEach(async() => {
        await Users.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new Users({username:'root', passwordHash:passwordHash})
        await user.save()
    })

    test('creation succeed with a fresh user', async() => {
        const UserAtStart = await helpers.userInDb()
        const newUser = {
            username: 'testuser@1',
            name: 'Test User',
            password:'Test@123'
        }
        await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const userAtEnd = await helpers.userInDb()
        assert.strictEqual(userAtEnd.length, UserAtStart.length +1)

        const userNames = userAtEnd.map(user => user.username)
        assert(userNames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async() => {
        const UserAtStart = await helpers.userInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helpers.userInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, UserAtStart.length)

    })

    test('creation fails with status 400 and error message if username is missing', async () => {
  const usersAtStart = await helpers.userInDb()

  const newUser = {
    name: 'Test User',
    password: 'password123'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('Username is required'))

  const usersAtEnd = await helpers.userInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails with status 400 and error message if username is less than 3 characters', async () => {
  const usersAtStart = await helpers.userInDb()

  const newUser = {
    username: 'ab',
    name: 'Test User',
    password: 'password123'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('Username must be at least 3 characters long'))

  const usersAtEnd = await helpers.userInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails with status 400 and error message if password is missing', async () => {
  const usersAtStart = await helpers.userInDb()

  const newUser = {
    username: 'testuser',
    name: 'Test User'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('Password is required'))

  const usersAtEnd = await helpers.userInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails with status 400 and error message if password is less than 3 characters', async () => {
  const usersAtStart = await helpers.userInDb()

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: '12'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('Password must be at least 3 characters long'))

  const usersAtEnd = await helpers.userInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})
})

after(async () => {
    await mongoose.connection.close()
})