const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

const userController = require('../controllers/userController');
const UserAuthenticationMiddleware = require('../middlewares/authMiddleware').UserAuthenticationMiddleware;


// Routes
app.post('/signup', userController.signup);
app.post('/login', userController.login);
app.patch('/users/:username', UserAuthenticationMiddleware, userController.updateUser);
app.post('/follow/:username', UserAuthenticationMiddleware, userController.followUser);
app.get('/notifications', UserAuthenticationMiddleware, userController.getNotifications);

module.exports = app;
