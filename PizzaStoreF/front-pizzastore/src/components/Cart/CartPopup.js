// CartPopup.js
import React from 'react';
import { Link } from 'react-router-dom';
import './CartPopup.css';

const CartPopup = ({ cartItems, onClose }) => {
  return (
    <div className="cart-popup">
      <button className="close-btn" onClick={onClose}>X</button>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <p>{item.name} - Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      )}
      <Link to="/cart">
        <button className="checkout-btn">Check Out</button>
      </Link>
    </div>
  );
};

export default CartPopup;
