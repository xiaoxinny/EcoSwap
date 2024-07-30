import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { TextField, Button, Paper, Container, CircularProgress } from '@mui/material';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await http.get(`/user/showusers/${id}`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validate contact number (must be numeric) if it has a value
    if (user.contactNumber && isNaN(user.contactNumber)) {
      newErrors.contactNumber = 'Contact Number must be numeric';
    }

    // Validate date of birth (must be in yyyy-mm-dd format) if it has a value
    if (user.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(user.dateOfBirth)) {
      newErrors.dateOfBirth = 'Date of Birth must be in yyyy-mm-dd format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await http.put(`/user/showusers/${id}`, user);
        navigate('/users');
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Container component={Paper} style={{ padding: '20px', marginTop: '20px' }}>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          value={user.email || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Username"
          name="username"
          value={user.username || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Contact Number"
          name="contactNumber"
          value={user.contactNumber || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.contactNumber}
          helperText={errors.contactNumber}
        />
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          value={user.dateOfBirth || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth}
        />
        <TextField
          label="Location"
          name="location"
          value={user.location || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={user.password || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Save
        </Button>
      </form>
    </Container>
  );
};

export default EditUser;
