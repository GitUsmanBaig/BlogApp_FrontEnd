import React, { useState } from 'react';
import Cookies from 'js-cookie';
const authToken = Cookies.get('auth_token');
import './UpdateUser.css';

const UpdateUserPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3003/user/UpdateUsers', {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                setMessage(responseData.message);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while updating the user.');
        }
    };
    
    return (
        <div className="update-user-container">
            <h1>Update User</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-groupp">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ 
                            'width': '100%',
                            'borderRadius': '20px',
                            'padding': '8px',
                            'boxSizing': 'border-box',
                            'marginBottom': '10px',
                            'backgroundColor' :'#253341',
                            'border': 'none',

                         }}
                    />
                </div>
                <div className="form-groupp">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ 
                            'width': '100%',
                            'borderRadius': '20px',
                            'padding': '8px',
                            'boxSizing': 'border-box',
                            'marginBottom': '10px',
                            'backgroundColor' :'#253341',
                            'border': 'none',

                         }}
                    />
                </div>
                <button type="submit">Update</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UpdateUserPage;
