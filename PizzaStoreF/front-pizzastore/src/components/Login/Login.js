import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext'; // Adjust the import path as needed
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use AuthContext to access login function

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!formData.username) {
      errors.username = 'Username is required';
      valid = false;
    }
    if (!formData.password) {
      errors.password = 'Password is required';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5002/api/users/login', formData);
      const { token, username, role } = response.data;

      // Use login function from AuthContext to manage authentication state
      login(token, username, role);
      console.log('username',username);
      console.log('token',token);
      console.log('role',role);

      setSuccessMessage('Login successful!');

      navigate('/');
    } catch (error) {
      setErrors({ server: 'Login failed, please check your credentials.' });
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {successMessage && <div className="success">{successMessage}</div>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <div className="error">{errors.username}</div>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div className="error">{errors.password}</div>}
        <button type="submit">Login</button>
        {errors.server && <div className="error">{errors.server}</div>}
      </form>
      <div className="register-link">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}

export default Login;
