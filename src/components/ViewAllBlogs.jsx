import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './ViewAllBlogs.css';

const authToken = Cookies.get('auth_token');

const ViewAllBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if the user is authenticated
                if (!authToken) {
                    setError('You are not authenticated. Please log in.');
                    setLoading(false);
                    return;
                }

                // Fetch blogs authored by the currently logged-in user
                const response = await fetch('http://localhost:3003/blog/userBlogs', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError('You are not authorized to view this page.');
                    } else {
                        setError('Failed to fetch data.');
                    }
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setBlogs(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setError('An error occurred while fetching blogs.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (title) => {
        try {
            console.log(title);
            const response = await fetch(`http://localhost:3003/blog/blogs/${title}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting blog');
            }

            // Remove the deleted blog from the local state to update the UI
            setBlogs(blogs.filter((blog) => blog.title !== title));
        } catch (error) {
            console.error('Error deleting the blog:', error);
        }
    };


    const handleEdit = (blog) => {
        setCurrentBlog(blog);
        setEditContent(blog.content);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            console.log(currentBlog.title);
            const response = await fetch(`http://localhost:3003/blog/blogs/update/${currentBlog.title}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ content: editContent }),
            });

            if (!response.ok) {
                throw new Error('Error updating blog');
            }

            // Update blog in local state
            setBlogs(blogs.map(blog => blog.title === currentBlog.title ? { ...blog, content: editContent } : blog));
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating the blog:', error);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };
    


    return (
        <div className="blog-container">
            <h1>Your Blogs</h1>
            {blogs.map((blog) => (
                <div key={blog._id} className="blog"
                    style={{
                        backgroundColor: '#253341'
                    }}
                >
                    <div className="blog-header">
                        <h2 style={
                            { color: '#189cee' }
                        }>{blog.title}</h2>
                        <div className="blog-buttons">
                            <button className="edit-button" onClick={() => handleEdit(blog)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(blog.title)}>Delete</button>
                        </div>
                    </div>
                    <p>{blog.content}</p>
                    <div className="blog-details">
                        <span>Author: {blog.author.username}</span>
                        <span>Rating: {blog.averageRating}</span>
                        <span>Created: {new Date(blog.creationDate).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Blog</h2>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAllBlogs;
