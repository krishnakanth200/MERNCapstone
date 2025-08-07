import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './MyBills.css'; // Ensure this file exists and is properly styled

const MyBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5002/api/orders/bills/mybills', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBills(response.data);
      } catch (err) {
        console.error('Error fetching bills:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-bills">
      {bills.length > 0 ? (
        <ul>
          {bills.map(bill => (
            <li key={bill.orderId} className="bill-item">
              <h3>Order ID: {bill.orderId}</h3>
              <p>Total Amount: ₹{bill.totalAmount}</p>
              <p>Date: {new Date(bill.createdAt).toLocaleDateString()}</p>
              <p>Items:</p>
              <ul>
                {bill.items && bill.items.length > 0 ? (
                  bill.items.map(item => (
                    <li key={item.productId}>
                      {item.productName} - ₹{item.price} x {item.quantity}
                    </li>
                  ))
                ) : (
                  <p>No items found in this bill</p>
                )}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bills found</p>
      )}
    </div>
  );
};

export default MyBills;
