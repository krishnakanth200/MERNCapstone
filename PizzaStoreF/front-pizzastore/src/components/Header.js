import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../Context/AuthContext';
import { NotificationContext } from '../Context/NotificationContext';
//import NotificationList from './Notification/NotificationList'; // Ensure the path is correct
import '../components/style/Header.css';

const Header = () => {
    const { token, role, username, logout } = useContext(AuthContext);
    const { unreadCount } = useContext(NotificationContext);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const fetchCartItemCount = async () => {
                try {
                    const response = await axios.get('http://localhost:5002/api/cart/count', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCartItemCount(response.data.count);
                } catch (error) {
                    console.error('Failed to fetch cart item count:', error);
                }
            };

            fetchCartItemCount();
        }
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">Circular-π</Link>
            </div>
            <nav className="nav">
                <Link to="/">Home</Link>
                {token && role !== 'admin' && <Link to="/menu">Menu</Link>}
                <Link to="/contact">Contact</Link>
                {token && role !== 'admin' && <Link to="/myorders">My Orders</Link>}
                {token && role === 'admin' && <Link to="/admin/products">Product Management</Link>}
                {token && role === 'admin' && <Link to="/admin/orders">Order Management</Link>}
                {token && role === 'admin' && <Link to="/admin/users">User</Link>}
                {token && role === 'admin' && <Link to="/admin/revenue">Revenue</Link>}
            </nav>
            <div className="nav-end">
                {token && role !== 'admin' && (
                    <div className="cart-icon">
                        <Link to="/cart">
                            <i className="fas fa-shopping-cart"></i>
                            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                        </Link>
                    </div>
                )}
                {!token && <Link to="/login">Login</Link>}
                {token && (
                    <div className="user-info">
                        <span>Hello, {username}</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                        <div className="notification-icon" onClick={toggleNotifications}>
                            <Link to="/notifications">
                                <i className="fas fa-bell"></i>
                                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
                            </Link>
                            
                       
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
