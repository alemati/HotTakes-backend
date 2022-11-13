const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


postsRouter.get('/', async (request, response, next) => { 
    try {
        const posts = await Post.find({}).populate('user', { name: 1 })
        response.json(posts)
    } catch (error) {
        next(error)
    }
})



postsRouter.post('/', async (request, response, next) => {
    const {content} = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    try {
        const user = await User.findById(decodedToken.id)
        const post = new Post({
            content: content, 
            user: user._id
        })
        const createdPost = await post.save()
        user.posts = user.posts.concat(createdPost._id)
        await user.save()
        response.json(createdPost)
    } catch (error) {
        next(error)
    }
})



postsRouter.delete('/:id', async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    try {
        const user = await User.findById(decodedToken.id)
        const post = await Post.findById(request.params.id)
    
        if (!(user._id.toString() === post.user._id.toString())) {
            return response.status(401).json({
                error: 'Signed in user cannot delete posts of another users'
            })
        }
        await post.delete()
        user.posts = user.posts.filter(p => p._id.toString() !== request.params.id)
        await user.save()
        response.status(200).end()
    } catch (error) {
        next(error)
    }
})



module.exports = postsRouter