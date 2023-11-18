const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('DB Connected!'))
    .catch(err => console.log(`DB Connection Error: ${err.message}`));

// Use routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);

app.listen(3003, () => console.log('Server started'));
