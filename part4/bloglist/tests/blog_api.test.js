const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blogs = require('../models/blog')
const api = supertest(app)
const helpers = require('./test_helpers')
const jwt = require('jsonwebtoken')
const Users = require('../models/user')
const bcrypt = require('bcrypt')

let token
beforeEach(async () => {
  await Blogs.deleteMany({})
  await Users.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new Users({ username: 'testuser', passwordHash })
  await user.save()

  const userForToken = { username: user.username, id: user._id }
  token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  const blogsWithUser = helpers.initialBlogs.map(blog => ({
    ...blog,
    user: user._id
  }))

  await Blogs.insertMany(blogsWithUser)

  const insertedBlogs = await Blogs.find({})
  user.blogs = insertedBlogs.map(blog => blog._id)
  await user.save()
})

test('blogs are returned as json', async() => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test ('all blogs returned', async() => {
    const result =  await api.get('/api/blogs')

    assert.strictEqual(result.body.length, helpers.initialBlogs.length)
})

test('unique identifier named id ', async() => {
  const response = await api.get('/api/blogs')
  const result = response.body[0]
  const keys = Object.keys(result) 

  assert(keys.includes('id'))
  assert.strictEqual(keys.includes('_id'), false)
})

test('a valid blog can be created with a valid token', async () => {
  const newBlog = {
    title: "Say My Name",
    author: "Walter White",
    url: "http://example.com",
    likes: 32,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await helpers.blogsInDb()
  assert.strictEqual(blogsAfter.length, helpers.initialBlogs.length + 1)

  const titles = blogsAfter.map(b => b.title)
  assert(titles.includes('Say My Name'))
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Test Author',
    url: 'http://test.com',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('Missing title property return status 400', async() => {
      const BlogWithoutTitle = {
        author: 'Nicolas Norambuena',
        url: 'https://ros.cwi.nl/',
      }

      await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(BlogWithoutTitle)
      .expect(400)

     const blogsAfter = await helpers.blogsInDb()

     assert.strictEqual(blogsAfter.length, helpers.initialBlogs.length)
})

test('Missing url property return stsatus 400 ', async() => {
    const blogWithoutUrl = {
    title: 'Test Blog',
    author: 'Nicolas Norambuena',
  }
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutUrl)
    .expect(400)

    const blogsAfter = await helpers.blogsInDb()

    assert.strictEqual(blogsAfter.length, helpers.initialBlogs.length)
})

test('blog can be deleted', async() => {
  const blogAtStart = await helpers.blogsInDb()
  const blogToDelete = blogAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogAtEnd = await helpers.blogsInDb()
  const id = blogAtEnd.map(blog => blog.id)

  assert(!id.includes(blogToDelete.id))
  assert.strictEqual(blogAtEnd.length, helpers.initialBlogs.length -1)
})

test('blog can be updated', async() => {
    const blogAtStart = await helpers.blogsInDb()
    const blogToUpdate = blogAtStart[0]
    
    const newBlogData = {
        title: "Vue patterns",
        author: "Michael jackson",
        url: "https://vuepatterns.com/",
        likes: 15
    }

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, newBlogData.title)
    assert.strictEqual(response.body.author, newBlogData.author)
    assert.strictEqual(response.body.url, newBlogData.url)
    assert.strictEqual(response.body.likes, newBlogData.likes)

    const blogAtEnd = await helpers.blogsInDb()
    const updatedBlog = blogAtEnd.find(blog => blog.id === blogToUpdate.id)
    
    assert.strictEqual(updatedBlog.title, newBlogData.title)
    assert.strictEqual(updatedBlog.author, newBlogData.author)
    assert.strictEqual(updatedBlog.url, newBlogData.url)
    assert.strictEqual(updatedBlog.likes, newBlogData.likes)

    assert.strictEqual(blogAtEnd.length, blogAtStart.length)
})

test('adding a blog fails with status 401 if token is not provided', async () => {
  const newBlog = {
    title: "No Token Blog",
    author: "Hacker",
    url: "http://hack.com",
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAfter = await helpers.blogsInDb()
  assert.strictEqual(blogsAfter.length, helpers.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})