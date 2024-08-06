/*This page is for people that logged in with google for the first time, they will need to create a 
password so that i can create them an account so they would be able to login even without google*/

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import http from '../../http';

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    const email = localStorage.getItem('googleEmail');
    const username = localStorage.getItem('googleUsername');
    const profilePicture = localStorage.getItem('googleProfilePicture')
    try {
      const response = await http.post('/user/set-password', { email, username, password, profilePicture });
      localStorage.removeItem('googleEmail');
      localStorage.removeItem('googleUsername');
      localStorage.removeItem('googleProfilePicture');
      localStorage.setItem('accessToken', response.data.accessToken); // Store the token
      setUser(response.data.user);
      console.log(response.data.user);
      setMessage('Password set successfully!');
      navigate('/account');
    } catch (error) {
      console.log(error)
      setMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Set Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Set Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SetPassword;
