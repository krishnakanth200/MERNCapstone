import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UserMangmentPage.css'; // Ensure this path is correct

const API_BASE_URL = 'http://localhost:5002/api/users'; // Ensure this is the correct base URL

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/useraccounts`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error.response || error.message);
                setError('Error fetching users');
                setLoading(false);
                toast.error('Error fetching users');
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${API_BASE_URL}/profile/delete/${userId}`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(users.filter(user => user._id !== userId));
            toast.success('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error.response || error.message);
            setError('Error deleting user');
            toast.error('Error deleting user');
        }
    };

    const handleEditClick = (user) => {
        // Handle edit user logic here (e.g., set a selected user state, show a form, etc.)
        toast.info('Edit user feature not yet implemented');
    };

    return (
        <div className="user-management-page">
            <h1>User Management</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(user)}>Edit</button>
                                        <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
