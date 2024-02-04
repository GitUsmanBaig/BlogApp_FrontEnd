import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import Cookies from 'js-cookie';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = searchUsername
        ? `http://localhost:3003/admin/admin/users/${searchUsername}`
        : 'http://localhost:3003/admin/admin/users';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('auth_token')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log(data);
      setUsers(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, isDisabled) => {
    try {
      const url = `http://localhost:3003/admin/admin/${isDisabled ? 'enable' : 'disable'}User/${userId}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('auth_token')
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isDisabled ? 'enable' : 'disable'} user`);
      }

      // Update the user status in the state to reflect the changes immediately
      setUsers(users.map(user => {
        if (user._id === userId) {
          return { ...user, disabled: !isDisabled };
        }
        return user;
      }));
    } catch (error) {
      console.error(`Error ${isDisabled ? 'enabling' : 'disabling'} user:`, error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchUsername(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="user-management-container">
        <div className="search-container">
          <input
            type="text"
            value={searchUsername}
            onChange={handleSearchChange}
            placeholder="Search by username..."
          />
          <button onClick={fetchUsers}>Search</button>
        </div>
        <div className="user-container">
          {users.map((user) => (
            <div  key={user._id} className={`user ${user.disabled ? 'disabled' : ''}`}>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <button 
                onClick={() => toggleUserStatus(user._id, user.disabled)}
                className={user.disabled ? 'enable-button' : 'disable-button'}>
                {user.disabled ? 'Enable' : 'Disable'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserManagement;
