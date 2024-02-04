import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Feed.css'; 
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; 
const authToken = Cookies.get('auth_token');

const Feed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:3003/blog/feed', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blogTitle) => {
    navigate(`/blog/${encodeURIComponent(blogTitle)}`); 
  };

  return (
    <>
      <Navbar />
      <div className="feed-container">
        <h1>Feed</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="blog-list">
            {blogs.map((blog) => (
              <li
                key={blog._id}
                className="blog-item"
                onClick={() => handleBlogClick(blog.title)} 
              >
                <h2>{blog.title}</h2>
                <p>{blog.content}</p>
                <div className="blog-details">
                  <span>Author: {blog.author.username}</span>
                  <span>Email: {blog.author.email}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Feed;
