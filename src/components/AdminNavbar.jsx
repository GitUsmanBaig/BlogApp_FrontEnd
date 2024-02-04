import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; 

const AdminNavbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/admin-dashboard');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowSidebar(false);
  };

  const handleLogout = async () => {
    try {
      // Send a POST request to log the user out on the server
      const response = await fetch('http://localhost:3003/user/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Clear the authentication token from cookies
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Redirect the user to the login page
        navigate('/login');
      } else {
        console.error('Error logging out:', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="navbar">
      <span className="company-name">CompanyName</span>
      <div className="nav-buttons">
        <button onClick={handleHomeClick}>Home</button>
        <button onClick={handleLoginClick}>Login</button>
        <button onClick={handleSignupClick}>Signup</button>
      </div>
      <button onClick={toggleSidebar} className="account-button">My Account</button>
      <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setShowSidebar(false)}>X</button>
        <button onClick={() => handleNavigation('/blog-users')}>Users</button>
        <button onClick={() => handleNavigation('/update-account')}>Update Account</button>
        <button onClick={() => handleNavigation('/create-blog')}>Add Blog</button>
        {/* <button onClick={() => handleNavigation('/view-all-blogs')}>View My Blog</button>
        <button onClick={() => handleNavigation('/user-notifications')}>Notifications</button> */}
        {/* <button 
        onClick={handleLogout} 
        className="logout-button"
          style={{
            backgroundColor: 'red', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            cursor: 'pointer'}} 
            >
          Logout
        </button> */}
        {/* <button onClick={() => handleNavigation('/feed')}>Feed</button> */}
      </div>
    </div>
  );
};

export default AdminNavbar;
