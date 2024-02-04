import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchFilter, setSearchFilter] = useState('keyword');
  const [sortCriteria, setSortCriteria] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (isSearchTriggered = false) => {
    setLoading(true);
    try {
      let url = 'http://localhost:3003/admin/blogs';
      if (isSearchTriggered) {
        if (searchKeyword) {
          switch (searchFilter) {
            case 'keyword':
              url += `/search/${encodeURIComponent(searchKeyword)}`;
              break;
            case 'rating':
              url += `/filter/${encodeURIComponent(searchKeyword)}`;
              break;
            case 'author':
              url += `/author/${encodeURIComponent(searchKeyword)}`;
              break;
            default:
              break;
          }
        }

        switch (sortCriteria) {
          case 'rating_asc':
            url += '/sortbyrating/asc';
            break;
          case 'rating_desc':
            url += '/sortbyrating/desc';
            break;
          case 'title_asc':
            url += '/sortbytitle/asc';
            break;
          case 'title_desc':
            url += '/sortbytitle/desc';
            break;
          case 'date/asc':
            url += '/sortbydate/sc';
            break;
          case 'date_desc':
            url += '/sortbydate/desc';
            break;
          default:
            break;
        }
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('auth_token')
        }
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

  const toggleBlogStatus = async (title, isEnabled) => {
    try {
      const url = `http://localhost:3003/admin/admin/${isEnabled ? 'enable' : 'disable'}Blog/${encodeURIComponent(title)}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('auth_token')
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEnabled ? 'enable' : 'disable'} blog`);
      }

      // Refresh the list of blogs
      fetchBlogs();
    } catch (error) {
      console.error(`Error ${isEnabled ? 'enabling' : 'disabling'} blog:`, error);
    }
  };

  // Event Handlers
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleFilterChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="search-sort-container">
        {/* Search and Sort UI */}
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
          <div key={blog._id} className="blog" style={{ backgroundColor: blog.disabled ? '#ffdddd' : '#253341' }}>
            <h2 style={
              {color:  '#189cee'}
            }
            >{blog.title}</h2>
            <p>{blog.content}</p>
            <div className="blog-details">
              <span>Author: {blog.author.username}</span>
              <span>Rating: {blog.averageRating}</span>
              <span>Created: {new Date(blog.creationDate).toLocaleDateString()}</span>
              <button 
                onClick={() => toggleBlogStatus(blog.title, blog.disabled)}
                style={{ backgroundColor: blog.disabled ? '#90ee90' : '#ff6347', color: '#ffffff' }}>
                {blog.disabled ? 'Enable' : 'Disable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminDashboard;
