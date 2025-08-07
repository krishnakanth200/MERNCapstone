import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Billing.css';

const Billing = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await axios.get('http://localhost:5002/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCartItems(data.cart.items);
        calculateTotalAmount(data.cart.items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Error fetching cart items.');
      } finally {
        setLoading(false);
      }
    };

    const calculateTotalAmount = (items) => {
      const total = items.reduce((acc, item) => {
        return acc + (item.product.price * item.quantity) + (item.product.tax * item.quantity);
      }, 0);

      setTotalAmount(total);
    };

    fetchCartItems();
  }, []);

  const handleProceedToOrder = async () => {
    try {
      // Extract product IDs from cart items
      const items = cartItems.map(item => item.product._id);

      // Create an order in the backend with just the product IDs
      const { data: order } = await axios.post('http://localhost:5002/api/orders', { 
        items // Send only the array of product IDs
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Navigate to the payment page with order ID and total amount
      navigate('/payment', { state: { orderId: order._id, totalAmount } });
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Error creating order. Please try again.');
    }
  };

  return (
    <div className="billing-container">
      <h1>Billing Information</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}
          <div className="billing-summary">
            <h2>Order Summary</h2>
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item._id} className="billing-item">
                  <img src={item.product.image} alt={item.product.name} className="billing-item-image" />
                  <div className="billing-item-info">
                    <p className="billing-item-name">{item.product.name}</p>
                    <p className="billing-item-price">Price: ₹{item.product.price}</p>
                    <p className="billing-item-quantity">Quantity: {item.quantity}</p>
                    <p className="billing-item-total">Total: ₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="billing-empty">Your cart is empty.</p>
            )}
            <h2>Total Amount: ₹{totalAmount.toFixed(2)}</h2>
            <button className="payment-button" onClick={handleProceedToOrder}>
              Proceed to Create Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Billing;
