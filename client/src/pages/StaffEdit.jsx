// Staff Edit their profile

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';
import defaultProfilePicture from '../assets/defaultProfilePicture.jpeg';
import './StaffEdit.css';

const StaffEdit = () => {
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
        const fetchStaffData = async () => {
            try {
                const response = await http.get('/staff/staff-profile');
                const staffData = response.data;
                setFormData({
                    username: staffData.username || '',
                    contactNumber: staffData.phoneNumber || '',
                    profilePicture: null,
                });
                if (staffData.profilePicture) {
                    setProfilePicturePreview(`http://localhost:3001/${staffData.profilePicture}`);
                }
            } catch (error) {
                setMessage('Error fetching staff data');
            }
        };

        fetchStaffData();
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
        const { username, contactNumber } = formData;

        // Validation checks
        if (!username || !/^[a-zA-Z0-9_]+$/.test(username)) {
            setMessage('Username contains invalid characters');
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (formData[key]) {
                formDataToSend.append(key, formData[key]);
            }
        }

        try {
            const response = await http.put('/staff/staff-profile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            setUser({ ...user, ...formData });
            navigate('/staff-info');
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Error updating staff details');
            }
        }
    };

    const handleEditPictureClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="staff-edit-container">
            <h2>Edit Staff Information</h2>
            {message && <p>{message}</p>}
            <div className="staff-edit-form">
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
                <button className="save-button" onClick={handleSave}>Save Changes</button>
            </div>
        </div>
    );
};

export default StaffEdit;
