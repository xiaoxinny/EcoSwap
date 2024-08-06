//This page is for the user to change their password

import React, { useState } from 'react';
import http from '../../http';
import './ChangePassword.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage('');
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (!validatePassword(newPassword)) {
      setMessage('New password must be at least 8 characters long and include at least 1 number.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      const response = await http.put('/user/change-password', {
        currentPassword,
        newPassword,
      });
      setMessage(response.data.message);
      
      // Clear input fields after successful submission
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      setMessage('Error while changing password: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
