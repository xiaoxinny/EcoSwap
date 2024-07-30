import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await http.post('/staff/staff-login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      setUser(response.data.staff)
      setMessage('Login successful!');
      navigate('/users'); // Redirect to a staff-specific page
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div>
      <h2>Staff Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Don't have an account? <Link to="/staff-register">Register</Link>
      </p>
    </div>
  );
};

export default StaffLogin;
