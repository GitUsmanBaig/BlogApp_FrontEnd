import React, { useState } from 'react';
import axios from 'axios';
import './CreateBlog.css';
import Cookies from 'js-cookie';
const authToken = Cookies.get('auth_token');

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3003/blog/createblog', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, 
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setMessage(responseData.message);
                setTitle('');
                setContent('');
            } else {
                const errorData = await response.json();
                setMessage(errorData.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while creating the blog.');
        }
    };

    return (
        <div className="create-blog-container">
            <h1>Create a New Blog</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button type="submit">Create Blog</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default CreateBlog;
