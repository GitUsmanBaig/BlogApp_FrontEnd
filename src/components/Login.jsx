import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import your CSS file
import Cookies from 'js-cookie';

const auth_token = Cookies.get('auth_token');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showInvalidCredentials, setShowInvalidCredentials] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a request to your server for authentication
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const role = data.role; 
        console.log(data.message);

        if (role === "admin") {
          navigate('/admin');
        } else {
          // Set a cookie for regular users
          Cookies.set('auth_token', data.message, { expires: 1 });

          // Set a flag in local storage for regular users
          localStorage.setItem('isLoggedIn', 'true');

          // Redirect to the homepage or desired page for regular users
          navigate('/');
        }
      } else {
        // Handle login failure
        console.error('Login failed');
        setShowInvalidCredentials(true);
      }
    } catch (error) {
      console.error('There was an error submitting the form', error);
    }
  };

  const handleCloseInvalidCredentials = () => {
    setShowInvalidCredentials(false);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="signup-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
      {showInvalidCredentials && (
        <div className="modal invalid-credentials">
          <p>Invalid credentials. Please try again.</p>
          <button onClick={handleCloseInvalidCredentials}>OK</button>
        </div>
      )}
    </div>
  );
};

export default Login;
