const Blog = require('../models/Blog');
const User = require('../models/User');

const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = new Blog({ title, content, author: req.user.id });
        await blog.save();
        res.json({ message: 'Blog created!' });
    } catch (err) {
        res.status(400).json({ message: 'Cannot create Blog!', error: err.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ title: req.params.title, disabled: false });

        // Check if the blog exists
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found!' });
        }

        // Compare the author's ObjectId with the logged-in user's ObjectId
        if (blog.author.equals(req.user.id)) {
            // Update the blog with new content from req.body
            await Blog.updateOne({ title: req.params.title }, { $set: req.body });
            res.json({ message: 'Blog updated successfully!' });
        } else {
            res.status(401).json({ message: 'You are not authorized to update this blog!' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating blog: ' + err.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ title: req.params.title, disabled: false });
        if (blog.author == req.user.id) {
            await Blog.updateOne({ title: req.params.title }, { $set: { disabled: true } });
            res.json({ message: 'Blog deleted!' });
        } else {
            res.status(401).json({ message: 'Access Denied!' });
        }
    } catch (err) {
        res.status(400).json({ message: 'Cannot delete Blog!' });
    }
};

const addCommentToBlog = async (req, res) => {
    try {
        const { text } = req.body;
        const blog = await Blog.findOne({ title: req.params.title, disabled: false }).populate('author');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found!' });
        }

        const comment = { user: req.user.id, text };
        blog.comments.push(comment);

        // Assuming the 'author' field in the blog schema references the User model
        const author = blog.author;
        if (author) {
            author.Notifications.push(`You have a new comment on your blog titled '${blog.title}'`);
            await author.save();
        }

        await blog.save();
        res.json({ message: 'Comment added!' });
    } catch (err) {
        res.status(400).json({ message: 'Cannot add comment!', error: err.message });
    }
};

const rateBlog = async (req, res) => {
    try {
        const { rating } = req.body;
        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating value!' });
        }
        const blog = await Blog.findOne({ title: req.params.title, disabled: { $ne: true } });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found!' });
        }
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated!' });
        }

        // Ensure ratings is an array
        if (!Array.isArray(blog.ratings)) {
            blog.ratings = [];
        }

        const userRating = blog.ratings.find(r => r.user.toString() === req.user.id.toString());
        if (userRating) {
            userRating.rating = rating;
        } else {
            blog.ratings.push({ user: req.user.id, rating });
        }
        const ratings = blog.ratings.map(r => r.rating);
        blog.averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        await blog.save();
        res.json({ message: 'Rating added!' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding rating', error: err.message });
    }
};

const viewAllBlogs = async (req, res) => {
    try{
        const blogs = await Blog.find({ disabled: false }).populate('author', 'username email');
        res.json(blogs);
    }catch(err){
        res.status(400).json({ message: 'Cannot fetch Blogs!' });
    }
};

const getBlogbyTitle = async (req, res) => {
    try{
        const blog = await Blog.findOne({ title: req.params.title, disabled: false }).populate('author', 'username email');
        res.json(blog);
    }catch(err){
        res.status(400).json({ message: 'Cannot fetch Blog!' });
    }
};

const getBlogbyAuthor = async (req, res) => {
    try {
        const { author } = req.params;
        const blogs = await Blog.find({ disabled: false })
                                 .populate({
                                     path: 'author',
                                     match: { username: author }
                                 })
                                 .where('author').exists(true);

        // Filter out blogs where the author didn't match (due to populate match condition)
        const filteredBlogs = blogs.filter(blog => blog.author);

        res.json(filteredBlogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs' });
    }
}

const getBlogbyRating = async (req, res) => {
    try {
        const { rating } = req.params;
        const blogs = await Blog.find({ averageRating: rating, disabled: false }).populate('author', 'username email');
        res.json(blogs);
    } catch (err) {
        // Instead of sending the error details, send a generic error message.
        res.status(500).json({ message: 'Error fetching blogs' });
    }
}

const sortBlogsByRating = async (req, res) => {
    try {
        const { order } = req.params;
        const blogs = await Blog.find({ disabled: false }).populate('author', 'username email').sort({ averageRating: order });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs' });
    }
};

const sortBlogsByDate = async (req, res) => {
    try {
        const { order } = req.params;
        const blogs = await Blog.find({ disabled: false }).populate('author', 'username email').sort({ creationDate: order });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs' });
    }
};

const sortBlogsByTitle = async (req, res) => {
    try {
        const { order } = req.params;
        const blogs = await Blog.find({ disabled: false }).populate('author', 'username email').sort({ title: order });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs' });
    }
};

const filterBlogByKeyWord = async (req, res) => {
    const keyword = req.params.keyword;
    try {

        const blogs = await Blog.find({title:{$regex:keyword, $options:'i'}, disabled: false});
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs' });
    }
};

const PaginateBlog = async (req, res) => {
    try {
        const { page } = req.params;
        const blogs = await Blog.find({ disabled: false }).populate('author', 'username email').skip((page - 1) * 5).limit(5);
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs' });
    }
}

const feed = async (req, res) => {
    try {
        const currentUser = req.user;

        // Check if currentUser is defined and has an id
        if (!currentUser || !currentUser.id) {
            console.error('Current user data is missing or invalid');
            return res.status(400).json({ message: 'Current user data is missing or invalid' });
        }

        console.log('Current User ID:', currentUser.id);
        const currUser = await User.findById(currentUser.id);

        // Check if currUser was successfully retrieved
        if (!currUser) {
            console.error('Current user not found in database');
            return res.status(404).json({ message: 'Current user not found in database' });
        }

        // Ensure currUser.followers is an array and not empty
        if (!Array.isArray(currUser.followers) || currUser.followers.length === 0) {
            console.log('No followers found for current user');
            return res.status(200).json({ message: 'No followers found for current user', blogs: [] });
        }

        console.log('Followers:', currUser.followers);
        const blogs = await Blog.find({ author: { $in: currUser.followers }, disabled: false }).populate('author', 'username email');

        // Check if blogs were found
        if (!blogs || blogs.length === 0) {
            console.log('No blogs found from followers');
            return res.status(200).json({ message: 'No blogs found from followers', blogs: [] });
        }

        res.json(blogs);
    } catch (err) {
        console.error('Error in feed function:', err);
        res.status(500).json({ message: 'Error fetching blogs', error: err.message });
    }
};




module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    addCommentToBlog,
    rateBlog,
    viewAllBlogs,
    getBlogbyTitle,
    getBlogbyAuthor,
    getBlogbyRating,
    sortBlogsByRating,
    sortBlogsByDate,
    sortBlogsByTitle,
    filterBlogByKeyWord,
    PaginateBlog,
    feed
};
