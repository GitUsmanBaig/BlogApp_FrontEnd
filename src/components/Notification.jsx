import React, { useState, useEffect } from 'react';
import './Notification.css';
import Cookies from 'js-cookie';
const authToken = Cookies.get('auth_token');

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch notifications when the component mounts
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:3003/user/notifications', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
    
            const data = await response.json();
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };
    

    return (
        <div className="notification-container">
            <h1>Notifications</h1>
            <ul className="notification-list">
                {notifications.map((notification, index) => (
                    <li key={index} className="notification-item">
                        {notification}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notification;
