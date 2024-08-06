//This page is basicallly for the user to view their profile

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import UserContext from '../../contexts/UserContext';
import defaultProfilePicture from '../../assets/defaultProfilePicture.jpeg';
import '../../styles/Accounts/AccountInfo.css'; 

const AccountInfo = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contactNumber: '',
    dateOfBirth: '',
    location: '',
    profilePicture: null,
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState(defaultProfilePicture);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await http.get('/user/profile');
        const userData = response.data;
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          contactNumber: userData.contactNumber || '',
          dateOfBirth: userData.dateOfBirth || '',
          location: userData.location || '',
          profilePicture: userData.profilePicture || null,
        });
        if (userData.profilePicture) {
          setProfilePicturePreview(`http://localhost:3001/${userData.profilePicture}`);
        } else {
          setProfilePicturePreview(defaultProfilePicture);
        }
      } catch (error) {
        setMessage('Error fetching user data');
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    navigate('/user-edit'); // Navigate to UserEdit
  };

  const handleChangePasswordClick = () => {
    navigate('/change-password'); // Navigate to ChangePassword
  };

  return (
    <div className="account-info-container">
      <h2>Account Information</h2>
      {message && <p>{message}</p>}
      <div className="account-info-card">
        <div className="profile-section">
          <img
            src={profilePicturePreview}
            alt="Profile"
            className="profile-picture"
          />
        </div>
        <div className="info-section">
          <div className="info-field">
            <label>Email:</label>
            <p>{formData.email}</p>
          </div>
          <div className="info-field">
            <label>Username:</label>
            <p>{formData.username}</p>
          </div>
          <div className="info-field">
            <label>Contact Number:</label>
            <p>{formData.contactNumber}</p>
          </div>
          <div className="info-field">
            <label>Date of Birth:</label>
            <p>{formData.dateOfBirth}</p>
          </div>
          <div className="info-field">
            <label>Location:</label>
            <p>{formData.location}</p>
          </div>
        </div>
      </div>
      <button className="edit-button" onClick={handleEditClick}>Edit Information</button>
      <button className="change-password-button" onClick={handleChangePasswordClick}>Change Password</button>
    </div>
  );
};

export default AccountInfo;
