import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DisplayBlog from './components/DisplayBlog';
import IndividualBlog from './components/IndividualBlog';
import Login from './components/Login';
import Register from './components/Register';
import UpdateUserPage from './components/UpdateUser'; 
import CreateBlog from './components/CreateBlog'; 
import ViewAllBlogs from './components/ViewAllBlogs'; 
import Notifications from './components/Notification';
import Feed from './components/Feed';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
// import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayBlog />} />
        <Route path="/blog/:title" element={<IndividualBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update-account" element={<UpdateUserPage />} />
        <Route path="/create-blog" element={<CreateBlog />} /> 
        <Route path="/view-all-blogs" element={<ViewAllBlogs />} /> 
        <Route path="/user-notifications" element={<Notifications />} />
        <Route path="/feed" element={<Feed />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/blog-users" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
