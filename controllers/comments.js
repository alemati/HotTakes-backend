/* eslint-disable no-unused-vars */
const commentsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')


commentsRouter.get('/', async (request, response, next) => { 
    try {
        const posts = await Comment.find({})
        response.json(posts)
    } catch (error) {
        next(error)
    }
})



commentsRouter.post('/', async (request, response, next) => {
    const { content, postId } = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    try {
        const user = await User.findById(decodedToken.id)
        const post = await Post.findById(postId)
        const comment = new Comment({
            content: content, 
            user: user._id,
            post: postId
        })
        const createdComment = await comment.save()
        post.comments = post.comments.concat(createdComment._id)
        await post.save()
        response.json(createdComment)
    } catch (error) {
        next(error)
    }
})

module.exports = commentsRouter