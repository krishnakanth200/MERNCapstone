import React from 'react';
import '../components/style/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2>Circular-π</h2>
                    <p>Delicious pizzas and more, right to your door.</p>
                </div>
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/menu">Menu</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/register">Register</a></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p>Email: support@Circularpi.com</p>
                    <p>Phone: +91 080456-7890</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 	Circularπ. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
