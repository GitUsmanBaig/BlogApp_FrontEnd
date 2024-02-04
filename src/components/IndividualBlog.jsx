import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './IndividualBlog.css';
import Cookies from 'js-cookie';

const IndividualBlog = () => {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false); 
  const { title } = useParams();
  const authToken = Cookies.get('auth_token');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:3003/blog/blogs/${title}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlog(data);
        loadComments(data.id);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [title, authToken]);

  const loadComments = async () => {
    try {
      const response = await fetch(`http://localhost:3003/blog/blogs/${title}/get-comments`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleRatingChange = (event) => {

    const newRatingValue = Math.min(5, Math.max(0, event.target.value));
    setNewRating(newRatingValue);
  };

  const submitComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3003/blog/blogs/${title}/comments`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ text: newComment }), 
        }
      );
  
      if (response.status === 201) {
        const commentData = await response.json(); 
        setComments([...comments, commentData]);
        console.log(comments)
        setNewComment('');
      } else {
        console.error('Error submitting comment. Status:', response.status); 
        await loadComments();
        setNewComment('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  
  const submitRating = async () => {
    try {
      // Limit ratings from 0 to 5
      const limitedRating = Math.min(5, Math.max(0, newRating));

      const response = await fetch(
        `http://localhost:3003/blog/blogs/${title}/ratings`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ rating: limitedRating }),
        }
      );

      if (response.ok) {
        // Handle the response (e.g., update average rating)
        
      } else {
        console.error('Error submitting rating. Status:', response.status);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  // Function to toggle follow status
  const toggleFollow = async () => {
    try {
      const response = await fetch(
        `http://localhost:3003/user/follow/${blog.author.username}`,

        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setIsFollowing(true);
      } else {
        console.error('Error following user. Status:', response.status);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="individual-blog-container">
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <div className="blog-details">
        <span>Author: {blog.author.username}</span>
        <span>Current Rating: {blog.averageRating}</span>
        <span>Created: {blog.creationDate}</span>
      </div>
      <div className="comments-section">
        <h3>Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            {comment.author} 
            {comment.text}
            {comment.creationDate}
          </div>
        ))}
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
        ></textarea>
        <button onClick={()=>submitComment(blog.title, newComment)}>Submit Comment</button>
      </div>
      <div className="rating-section">
        <label htmlFor="rating">Your Rating:</label>
        <input
          type="number"
          id="rating"
          value={newRating}
          onChange={handleRatingChange}
        />
        <button onClick={submitRating}>Submit Rating</button>
      </div>
      <div className="follow-section">
        {isFollowing ? (
          <button>Following</button>
        ) : (
          <button onClick={toggleFollow}>Follow</button>
        )}
      </div>
    </div>
  );
};

export default IndividualBlog;
