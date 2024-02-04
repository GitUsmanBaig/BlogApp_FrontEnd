import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './DisplayBlog.css';


const DisplayBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading state to true
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchFilter, setSearchFilter] = useState('keyword');
  const [sortCriteria, setSortCriteria] = useState('');
  const navigate = useNavigate();

  const fetchBlogs = async (isSearchTriggered = false) => {
    setLoading(true);
    try {
      let url = 'http://localhost:3003/blog/blogs';
      if (isSearchTriggered) {
        if (searchKeyword) {
          if (searchFilter === 'keyword') {
            url += `/search/${(searchKeyword)}`;
          } else if (searchFilter === 'rating') {
            url += `/filter/${(searchKeyword)}`;
          } else if (searchFilter === 'author') {
            url += `/author/${(searchKeyword)}`;
          }
        }

        if (sortCriteria) {
          if (sortCriteria === 'rating_asc') {
            url += '/sortbyrating/asc';
          } else if (sortCriteria === 'rating_desc') {
            url += '/sortbyrating/desc';
          } else if (sortCriteria === 'title_asc') {
            url += '/sortbytitle/asc';
          } else if (sortCriteria === 'title_desc') {
            url += '/sortbytitle/desc';
          }else if (sortCriteria === 'date_asc') {                                                                                                                     
            url += '/sortbydate/asc';
          }else if (sortCriteria === 'date_desc') {                                                                                                                     
            url += '/sortbydate/desc';
          }
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBlogs(data);
      console.log(data);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blogs initially when the component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Event handlers
  const handleBlogClick = (blogTitle) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate(`/blog/${encodeURIComponent(blogTitle)}`);
    } else {
      navigate('/login');
    }
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  // Render Loading... when fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render blog component
  return (
    <>
      <Navbar />
      <div className="search-sort-container">
        <div className="search-container">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="Enter search term..."
          />
          <select value={searchFilter} onChange={handleFilterChange}>
            <option value="keyword">Search by Keyword</option>
            <option value="rating">Filter by Rating</option>
            <option value="author">Filter by Author</option>
          </select>
          <button onClick={() => fetchBlogs(true)}>Search</button>
        </div>
        <div className="sort-container">
          <select value={sortCriteria} onChange={handleSortChange}>
            <option value="">Default</option>
            <option value="rating_asc">Rating Ascending</option>
            <option value="rating_desc">Rating Descending</option>
            <option value="title_asc">Title Ascending</option>
            <option value="title_desc">Title Descending</option>
            <option value="date_asc">Date Ascending </option>
            <option value="date_desc">Date Descending</option>
          </select>
        </div>
      </div>
      <div className="blog-container">
        {blogs.map((blog) => (
          <div key={blog._id} className="blog" 
          style={{
            backgroundColor: '#253341'
          }}
          onClick={() => handleBlogClick(blog.title)}>
            <h2 style={
              {color:  '#189cee'}
            }>{blog.title}</h2>
            <p>{blog.content}</p>
            <div className="blog-details">
              <span>Author: {blog.author.username}</span>
              <span>Rating: {blog.averageRating}</span>
              <span>Created: {new Date(blog.creationDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DisplayBlog;
