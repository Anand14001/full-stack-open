const blogRouter = require('express').Router()
const blogs = require('../models/blog') 
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async(request, response, next) => {
    try{
        const Blogs = await blogs.find({}).populate('user',{username:1, name:1})
        response.json(Blogs)
    }catch(error){
        next(error)
    }
})

blogRouter.get('/:id', async (request, response, next) => {
    try {
        const result = await blogs.findById(request.params.id)
        if (result) {
            response.json(result)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})
blogRouter.put('/:id', userExtractor, async (request, response, next) => {
    try {
        const user = request.user
        const blog = await blogs.findById(request.params.id)

        if (!blog) {
            return response.status(404).end()
        }

        if (blog.user.toString() !== user._id.toString()) {
            return response.status(403).json({ error: 'only the creator can update a blog' })
        }

        const updatedBlog = await blogs.findByIdAndUpdate(
            request.params.id, 
            request.body, 
            { new: true, runValidators: true, context: 'query' }
        )
        
        response.json(updatedBlog)
    } catch(error) {
        next(error)
    }
})

blogRouter.delete('/:id', userExtractor, async(request, response, next) => {
    try {
        const user = request.user  
        const blog = await blogs.findById(request.params.id)

        if (!blog) {
            return response.status(404).end()
        }

        if (blog.user.toString() !== user._id.toString()) {
            return response.status(403).json({ error: 'only the creator can delete a blog' })
        }

        await blogs.findByIdAndDelete(request.params.id)
        
        user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id)
        await user.save()
        
        response.status(204).end()
    } catch(error) {
        next(error)
    }
})

blogRouter.post('/', userExtractor, async(request, response, next) => {
    const body = request.body
    const user = request.user

    const Blog = new blogs({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    try{
        const saveBlog = await Blog.save()
        user.blogs = user.blogs.concat(saveBlog._id)
        await user.save()
        response.status(201).json(saveBlog)
    } catch(error){
        next(error)
    }
})

module.exports = blogRouter