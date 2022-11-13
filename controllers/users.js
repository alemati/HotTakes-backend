const usersRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')


usersRouter.get('/', async (request, response, next) => { 
    try {
        const users = await User.find({})
        response.json(users)
    } catch (error) {
        next(error)
    }
})


usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    try {
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return response.status(400).json({
                error: 'Username must be unique'
            })
        } else if (password.length < 4) {
            return response.status(400).json({
                error: 'Password should be at least 4 characters long'
            })
        }
      
        const user = new User({ username, name, passwordHash })
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
})

// todo
usersRouter.delete('/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
    const posts = await Post.find({ '_id': { $in: user.posts } })
    console.log('posts of deleted person are:', posts)
    response.status(200)
})


module.exports = usersRouter