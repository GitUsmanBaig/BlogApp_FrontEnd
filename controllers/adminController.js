const User = require('../models/User');
const Blog = require('../models/Blog');

const disableUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        user.disabled = true;
        await user.save();
        res.json({ message: 'User has been disabled!' });
    } catch (err) {
        res.status(500).json({ message: 'Error disabling user', error: err.message });
    }
};

const enableUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        user.disabled = false;
        await user.save();
        res.json({ message: 'User has been enabled!' });
    } catch (err) {
        res.status(500).json({ message: 'Error enabling user', error: err.message });
    }
};

const listUsers = async (req, res) => {
    try {
        const users = await User.find({ disabled: false }).select('username email role');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username, disabled: false });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
};
const disableBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ title: req.params.title, disabled: false });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found!' });
        }
        blog.disabled = true;
        await blog.save();
        res.json({ message: 'Blog has been disabled!' });
    } catch (err) {
        res.status(500).json({ message: 'Error disabling blog', error: err.message });
    }
};

const enableBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ title: req.params.title, disabled: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found!' });
        }
        blog.disabled = false;
        await blog.save();
        res.json({ message: 'Blog has been enabled!' });
    } catch (err) {
        res.status(500).json({ message: 'Error enabling blog', error: err.message });
    }
};

module.exports = {
    disableUser,
    enableUser,
    listUsers,
    getUserByUsername,
    disableBlog,
    enableBlog
};
