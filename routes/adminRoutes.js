const express = require('express');
const app = express();

const adminController = require('../controllers/adminController');

//get middleware
const {AdminAuthenticationMiddleware} = require('../middlewares/authMiddleware');

// Routes
app.get('/admin/users', AdminAuthenticationMiddleware, adminController.listUsers);
app.get('/admin/users/:username', AdminAuthenticationMiddleware, adminController.getUserByUsername );
app.post('/admin/disableBlog/:title', AdminAuthenticationMiddleware, adminController.disableBlog );
app.post('/admin/enableBlog/:title', AdminAuthenticationMiddleware, adminController.enableBlog );
app.post('/admin/enableUser/:userId', AdminAuthenticationMiddleware, adminController.enableUser );
app.post('/admin/disableUser/:userId', AdminAuthenticationMiddleware, adminController.disableUser );
module.exports = app;