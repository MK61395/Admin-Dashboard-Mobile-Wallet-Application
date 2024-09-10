import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/logo.png';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { name, password: '****' });
      const response = await axios.post('http://localhost:5000/auth/login', { name, password });
      console.log('Login response:', response.data);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        onLogin();
        navigate('/analytics');  // Always redirect to /analytics after successful login
      } else {
        setError('Login failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error.response || error);
      setError('Login error: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Ritter Dahait Logo" className="login-logo" />
          <h1>Ritter Dahait</h1>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Admin Login</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label htmlFor="name">Username</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;