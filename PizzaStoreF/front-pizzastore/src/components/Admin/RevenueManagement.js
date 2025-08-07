import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './RevenueManagement.css';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const RevenueManagement = () => {
    const [revenue, setRevenue] = useState(null);
    const [dailyRevenue, setDailyRevenue] = useState(0);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const token = localStorage.getItem('token');

    const config = useMemo(() => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }), [token]);

    useEffect(() => {
        const fetchDailyRevenue = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/orders/revenue/daily', config);
                setDailyRevenue(response.data.revenue);
            } catch (err) {
                setError('Failed to fetch daily revenue.');
            }
        };

        const fetchMonthlyRevenue = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/orders/revenue/monthly', config);
                setRevenue(response.data.revenue);
                setSuccessMessage('Monthly revenue fetched successfully.');
            } catch (err) {
                setError('Failed to fetch monthly revenue.');
            }
        };

        fetchDailyRevenue();
        fetchMonthlyRevenue();
    }, [config]);

    // Prepare data for the pie chart
    const pieChartData = {
        labels: ['Daily Revenue', 'Monthly Revenue'],
        datasets: [
            {
                data: [dailyRevenue, revenue || 0], // Ensure revenue is not null
                backgroundColor: ['#FF6384', '#36A2EB'],
                borderColor: ['#FF6384', '#36A2EB'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="revenue-management-container">
            <h2>Revenue Management</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <div>
                <h2>Daily Revenue: ${dailyRevenue}</h2>
            </div>
            {revenue !== null && (
                <div>
                    <h2>Monthly Revenue: ${revenue}</h2>
                </div>
            )}
            <div className="pie-chart-container">
                <Pie data={pieChartData} />
            </div>
        </div>
    );
};

export default RevenueManagement;
