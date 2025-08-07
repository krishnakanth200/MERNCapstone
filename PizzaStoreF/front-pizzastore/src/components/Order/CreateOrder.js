import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateOrder = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const { data } = await axios.get('http://localhost:5002/api/cart', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setCartItems(data.cart.items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Error fetching cart items.');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5002/api/orders', { items: selectedItems });
            alert('Order created successfully!');
            // Navigate to the orders page or reset the form as needed
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleItemSelect = (id) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(id)
                ? prevSelectedItems.filter((itemId) => itemId !== id)
                : [...prevSelectedItems, id]
        );
    };

    return (
        <div>
            <h2>Create Order</h2>
            {loading ? (
                <p>Loading cart items...</p>
            ) : (
                <>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div>
                            {cartItems.length > 0 ? (
                                cartItems.map(item => (
                                    <div key={item._id}>
                                        <input
                                            type="checkbox"
                                            value={item.product._id}
                                            checked={selectedItems.includes(item.product._id)}
                                            onChange={() => handleItemSelect(item.product._id)}
                                        />
                                        {item.product.name} - ${item.product.price} x {item.quantity}
                                    </div>
                                ))
                            ) : (
                                <p>Your cart is empty.</p>
                            )}
                        </div>
                        <button type="submit">Place Order</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default CreateOrder;
