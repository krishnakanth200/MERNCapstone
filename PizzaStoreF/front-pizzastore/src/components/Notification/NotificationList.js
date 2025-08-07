import React from 'react';
import { useNotificationContext } from '../../Context/NotificationContext';
import './Notification.css';

const NotificationList = () => {
    const { notifications, markAsRead } = useNotificationContext();

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
                <p>No notifications</p>
            ) : (
                <ul>
                    {notifications.map(notification => (
                        <li key={notification._id}>
                            <p>{notification.message}</p>
                            {!notification.read && (
                                <button onClick={() => markAsRead(notification._id)}>Mark as read</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationList;
