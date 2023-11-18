const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        text: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        }
    }],
    disabled: {
        type: Boolean,
        default: false,
    }
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
