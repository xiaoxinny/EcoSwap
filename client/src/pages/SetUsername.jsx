/* This page is for user to set a username after they created an account (not google) normal registration */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import http from '../http';
import UserContext from '../contexts/UserContext';

const SetUsername = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState(''); // State to store error or success messages
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await http.put('/user/set-username', { username });
      setUser({ ...user, username: response.data.username });
      navigate('/account');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message); // Display error message
      } else {
        setMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h2>Set Username</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Set Username</button>
      </form>
      {message && <p>{message}</p>} {/* Display the message */}
    </div>
  );
};

export default SetUsername;
