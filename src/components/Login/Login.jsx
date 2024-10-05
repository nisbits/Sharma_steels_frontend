import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log("Refresh Token:", refreshToken);
    if (!refreshToken) {
      setError('Session expired. Please log in again.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      return null;
    }

  
    try {
      const response = await fetch('http://sharmasteel.in:8080/user-accounts/token/refresh/', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }), 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        return data.access;
      } else {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        return null;
      }
    } catch (err) {
      console.error('Error refreshing token:', err);
      setError('Unable to refresh session. Please log in again.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      return null;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://sharmasteel.in:8080/user-accounts/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: mobile,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        alert('Login successful!');
        navigate('/');
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  // Function to handle API requests with token refresh logic
  const fetchDataWithToken = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');

    // Set the Authorization header with the current access token
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    let response = await fetch(url, options);

    // If the token is expired (403/401 response), refresh it and retry the request
    if (response.status === 401 || response.status === 403) {
      accessToken = await refreshToken();
      if (accessToken) {
        options.headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(url, options); // Retry with new token
      }
    }

    return response;
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputMobile">Mobile Number</label>
          <input
            type="tel"
            className="form-control"
            id="exampleInputMobile"
            placeholder="Enter mobile number"
            pattern="[0-9]{10}"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
