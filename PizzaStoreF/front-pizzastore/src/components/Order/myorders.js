import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyOrders.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5002/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5002/api/orders/${orderId}/cancel`, 
      {},  // Empty object for the POST body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: 'canceled' } : order
        ));
      }
    } catch (err) {
      setError('Failed to cancel the order.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="user-orders">
      {orders && orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ₹{order.totalAmount}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              {order.status === 'pending' && (
                <button onClick={() => handleCancelOrder(order._id)} className="cancel-button">
                  Cancel Order
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default UserOrders;
