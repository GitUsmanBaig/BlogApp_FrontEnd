const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());


const UserAuthenticationMiddleware =  (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).send('Access Denied. Please login first.');

    try {
        const verified = jsonwebtoken.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token. Please login again.');
    }
}

const AdminAuthenticationMiddleware = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).send('Access Denied. Please login first.');
    try {
        const verified = jsonwebtoken.verify(token, process.env.SECRET_KEY);
        req.admin = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token. Please login again.');
    }
}


module.exports = { UserAuthenticationMiddleware, AdminAuthenticationMiddleware };
