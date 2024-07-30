//Registration page for users

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';
import GoogleLoginButton from './GoogleLoginButton';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await http.post('/user/register', { email, password });
      setMessage(response.data.message);
      setErrors([]);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setMessage(error.response.data.message);
      }
    }
    
  };
  const handleSuccess = async (response) => {
    console.log('Login successful:', response);
    const decodedToken = JSON.parse(atob(response.credential.split('.')[1]));
    console.log('Decoded Token:', decodedToken);
    
    const email = decodedToken.email;
    const username = decodedToken.name;
    const profilePicture = decodedToken.picture;
  
    try {
      const res = await http.post('/user/check-email', { email });
      if (res.data.exists) {
        localStorage.setItem('accessToken', res.data.accessToken);
        setUser(res.data.user);
        navigate('/account');
      } else {
        // Store the email and username temporarily and navigate to set password
        localStorage.setItem('googleEmail', email);
        localStorage.setItem('googleUsername', username);
        localStorage.setItem('googleProfilePicture', profilePicture);
        navigate('/set-password');
      }
    } catch (error) {
      console.log(error)
      setMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
      <div>
        <h3>Or Sign In with Google</h3>
        <GoogleLoginButton
          onSuccess={handleSuccess}
          onFailure={(error) => setMessage(error.message)}
        />
      </div>
    </div>
  );
};

export default Register;
