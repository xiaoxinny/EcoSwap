import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';
import GoogleLoginButton from './GoogleLoginButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await http.post('/user/login', { email, password });
      console.log(response.user)
      localStorage.setItem('accessToken', response.data.accessToken);
      setUser(response.data.user);
      setMessage('Login successful!');
      if (!response.data.user.username) {
        navigate('/set-username');
      } else {
        navigate('/account');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again later.');
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
      setMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again later.');
    }
  };
  
  

  return (
    <div>
      <h2>Login</h2>
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
      <p>Don't have an account? <Link to="/register">Register</Link></p>
      <div>
        <h3>Or login with Google</h3>
        <GoogleLoginButton
          onSuccess={handleSuccess}
          onFailure={(error) => setMessage(error.message)}
        />
      </div>
    </div>
  );
};

export default Login;
