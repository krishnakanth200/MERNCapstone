// Popup.js
import React, { useEffect } from 'react';
import './Popup.css';

const Popup = ({ message, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 4000); // Auto-close after 4 seconds
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div className={`popup ${show ? 'show' : ''}`}>
            {message}
        </div>
    );
};

export default Popup;
