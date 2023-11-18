const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    disabled: {
        type: Boolean,
        default: false
    },
    Notifications: [{
       type: String
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
