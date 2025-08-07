import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/cart', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const cartData = response.data.cart;
                setCart(cartData);
                calculateTotalAmount(cartData.items);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();
    }, []);

    const calculateTotalAmount = (items) => {
        const total = items.reduce((acc, item) => {
            return acc + item.product.price * item.quantity;
        }, 0);
        setTotalAmount(total);
    };

    const handleRemove = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5002/api/cart/remove/${itemId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Refresh cart data
            const response = await axios.get('http://localhost:5002/api/cart', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const cartData = response.data.cart;
            setCart(cartData);
            calculateTotalAmount(cartData.items);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            await axios.put(`http://localhost:5002/api/cart/update/${itemId}`, {
                quantity: newQuantity
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Refresh cart data
            const response = await axios.get('http://localhost:5002/api/cart', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const cartData = response.data.cart;
            setCart(cartData);
            calculateTotalAmount(cartData.items);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleCheckout = () => {
        if (totalAmount > 0) {
            navigate('/billing');
        } else {
            alert('Your cart is empty, please add items to your cart before proceeding.');
        }
    };

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            <div className="cart-items">
                {cart ? (
                    <>
                        {cart.items.map(item => (
                            <div key={item._id} className="cart-item">
                                <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <h3 className="cart-item-name">{item.product.name}</h3>
                                    <p className="cart-item-price">Price: ${item.product.price}</p>
                                    <div className="cart-item-quantity">
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                            <FaArrowDown />
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                            min="1"
                                        />
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
                                            <FaArrowUp />
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => handleRemove(item._id)} className="cart-item-remove">
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </>
                ) : (
                    <p className="cart-empty">Loading cart...</p>
                )}
            </div>
            <div className="cart-summary">
                <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
                <button onClick={handleCheckout} className="checkout-button">Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
