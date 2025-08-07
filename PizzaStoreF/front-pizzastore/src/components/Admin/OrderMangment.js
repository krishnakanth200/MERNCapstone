import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import './OrderMangment.css'; 

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    const config = useMemo(() => ({
        headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
    }), [token]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/orders/order', config);
                console.log(response.data); // Log the response data
                setOrders(response.data);
            } catch (err) {
                toast.error('Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [config]);

    const handleSendNotification = async (userId, message) => {
        try {
            await axios.post('http://localhost:5002/api/notifications', {
                userId,
                message,
            }, config);
            toast.success('Notification sent successfully.');
        } catch (err) {
            toast.error('Failed to send notification.');
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await axios.put(`http://localhost:5002/api/orders/${orderId}/status`, null, {
                ...config,
                params: { status },
            });
            const updatedOrders = orders.map(order => 
                order._id === orderId ? { ...order, status } : order
            );
            setOrders(updatedOrders);
            
            // Send notification
            const order = updatedOrders.find(order => order._id === orderId);
            if (order) {
                const message = `Your order ${order._id} status has been updated to ${status}.`;
                handleSendNotification(order.user._id, message);
            }

            toast.success('Order status updated successfully.');
        } catch (err) {
            toast.error('Failed to update order status.');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:5002/api/orders/${orderId}`, config);
            setOrders(orders.filter(order => order._id !== orderId));
            toast.success('Order deleted successfully.');
        } catch (err) {
            toast.error('Failed to delete order.');
        }
    };

    const handleGenerateBill = async (userId) => {
        try {
            const response = await axios.post(`http://localhost:5002/api/orders/user/${userId}/bill`, null, config);
            // Handle the bill generation response (e.g., display in a modal or download as PDF)
            console.log(response.data);
            toast.success('Bill generated successfully.');
        } catch (err) {
            toast.error('Failed to generate bill.');
        }
    };

    return (
        <div className="order-management-container">
            <h1>Order Management</h1>
            {loading ? <p>Loading...</p> : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User Name</th> {/* New column for User Name */}
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user ? order.user.name : 'N/A'}</td> {/* Display User Name */}
                                <td>{order.items.map(item => item.name).join(', ')}</td>
                                <td>${order.totalAmount.toFixed(2)}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                        className="select-box"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="update-status" onClick={() => handleDeleteOrder(order._id)}>Delete</button>
                                    <button className="generate-bill" onClick={() => handleGenerateBill(order.user._id)}>Generate Bill</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <ToastContainer />
        </div>
    );
};

export default OrderManagement;
