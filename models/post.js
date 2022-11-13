const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    content: {
        type: String,
        minLength: 2,
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
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
})


postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Post', postSchema)