const User = require('../models/User');
const jsonwebtoken = require('jsonwebtoken');

const signup = async (req, res) => {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role, followers: [] });
    try {
        await user.save();
        res.json({ message: 'User created!' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && password === user.password) {
            const token = jsonwebtoken.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' });
            res.cookie('auth_token', token);
            res.json({ message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} logged in!` });
        } else {
            res.status(400).json({ message: 'Invalid credentials!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { username } = req.params;
    const updates = req.body;
    try {
        const user = await User.findOne({ username, disabled: false });
        if (user && user._id.toString() === req.user.id) {
            await User.updateOne({ username }, { $set: updates });
            res.json({ message: 'User updated!' });
        } else {
            res.status(401).json({ message: 'Access Denied or User not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

const followUser = async (req, res) => {
    const usernameToFollow = req.params.username;
    const currentUser = req.user;
    try {
        const currUser = await User.findById(currentUser.id);
        const userToFollow = await User.findOne({ username: usernameToFollow, disabled: false });
        if (userToFollow && !currUser.followers.includes(userToFollow._id)) {
            currUser.followers.push(userToFollow._id);
            userToFollow.Notifications.push(`${currUser.username} started following you!`);
            await currUser.save();
            await userToFollow.save();
            res.json({ message: 'Successfully followed the user!' });
        } else {
            res.status(400).json({ message: 'User not found or already followed!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error following user', error: error.message });
    }
};

const getNotifications = async (req, res) => {
    const currentUser = req.user;
    try {
        const userWithNotifications = await User.findById(currentUser.id).select('Notifications');
        res.json({ notifications: userWithNotifications.Notifications });
        userWithNotifications.Notifications = [];
        await userWithNotifications.save();
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

module.exports = {
    signup,
    login,
    updateUser,
    followUser,
    getNotifications
};
