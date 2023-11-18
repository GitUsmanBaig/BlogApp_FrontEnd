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

const blogController = require('../controllers/blogController');
const UserAuthenticationMiddleware = require('../middlewares/authMiddleware').UserAuthenticationMiddleware;

// Routes
app.get('/blogs',UserAuthenticationMiddleware, blogController.viewAllBlogs);
app.get('/blogs/:title',UserAuthenticationMiddleware, blogController.getBlogbyTitle);
app.post('/createblog', UserAuthenticationMiddleware, blogController.createBlog);
app.post('/blogs/update/:title', UserAuthenticationMiddleware, blogController.updateBlog);
app.delete('/blogs/:title', UserAuthenticationMiddleware, blogController.deleteBlog);
app.post('/blogs/:title/comments', UserAuthenticationMiddleware, blogController.addCommentToBlog);
app.post('/blogs/:title/ratings', UserAuthenticationMiddleware, blogController.rateBlog);
app.get('/blogs/filter/:rating', UserAuthenticationMiddleware,blogController.getBlogbyRating);
app.get('/blogs/author/:author', UserAuthenticationMiddleware,blogController.getBlogbyAuthor);
app.get('/blogs/sortbyrating/:order', UserAuthenticationMiddleware,blogController.sortBlogsByRating);
app.get('/blogs/sortbytitle/:order', UserAuthenticationMiddleware, blogController.sortBlogsByTitle);
app.get('/blogs/sortbydate/:order', UserAuthenticationMiddleware, blogController.sortBlogsByDate);
app.get('/blogs/search/:keyword', UserAuthenticationMiddleware, blogController.filterBlogByKeyWord);
app.get('/blogs/page/:page', UserAuthenticationMiddleware, blogController.PaginateBlog);
app.get('/blogs/feed', UserAuthenticationMiddleware, blogController.feed);


module.exports = app;
