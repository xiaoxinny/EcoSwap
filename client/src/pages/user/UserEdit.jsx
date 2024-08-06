// User to edit their own profile

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import UserContext from '../../contexts/UserContext';
import defaultProfilePicture from '../assets/defaultProfilePicture.jpeg';
import './UserEdit.css';

const UserEdit = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    contactNumber: '',
    dateOfBirth: '',
    location: '',
    profilePicture: null,
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState(defaultProfilePicture);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await http.get('/user/profile');
        const userData = response.data;
        setFormData({
          username: userData.username || '',
          contactNumber: userData.contactNumber || '',
          dateOfBirth: userData.dateOfBirth || '',
          location: userData.location || '',
          profilePicture: null,
        });
        if (userData.profilePicture) {
          setProfilePicturePreview(`http://localhost:3001/${userData.profilePicture}`);
        }
      } catch (error) {
        setMessage('Error fetching user data');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contactNumber' && !/^\d*$/.test(value)) {
      setMessage('Contact number must be numeric');
      return;
    }
    
    if (name === 'username' && !/^[a-zA-Z0-9_]+$/.test(value)) {
      setMessage('Username contains invalid characters');
      return;
    }
    
    setFormData({ ...formData, [name]: value });
    setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const { username, contactNumber, dateOfBirth, location } = formData;

    // Validation checks
    const today = new Date().toISOString().split('T')[0];
    const minDate = '1900-01-01';

    if (!username || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setMessage('Username contains invalid characters');
      return;
    }

    if(dateOfBirth) 
      if(dateOfBirth > today || dateOfBirth < minDate) {
        setMessage('Date of Birth must be between 1900-01-01 and today');
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await http.put('/user/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      setUser({ ...user, ...formData });
      navigate('/account');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error updating user details');
      }
    }
  };

  const handleEditPictureClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="user-edit-container">
      <h2>Edit User Information</h2>
      {message && <p>{message}</p>}
      <div className="user-edit-form">
        <div className="form-field">
          <label>Profile Picture:</label>
          <img
            src={profilePicturePreview}
            alt="Profile"
            className="profile-picture"
          />
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button onClick={handleEditPictureClick}>Change Picture</button>
        </div>
        <div className="form-field">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]} // Set max date to today
            min="1900-01-01"
          />
        </div>
        <div className="form-field">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <button className="save-button" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default UserEdit;
