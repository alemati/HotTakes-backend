const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        minLength: 3,
        maxLength: 200
    },
    likes: {
        type: Number, default: 0,
    },
    date: {
        type: Date, default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
})


commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Comment', commentSchema)