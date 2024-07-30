import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Home from './pages/home';
import SetPassword from './pages/SetPassword';
import MyTheme from './themes/MyTheme';
import Register from './pages/Register';
import Login from './pages/Login';
import AccountInfo from './pages/AccountInfo';
import Users from './pages/Users';
import UserEdit from './pages/UserEdit';
import SetUsername from './pages/SetUsername';
import Password from './pages/ChangePassword';
import EditUser from './pages/EditUser';
import Staff from './pages/Staff';
import UserContext from './contexts/UserContext';
import http from './http';
import StaffRegister from './pages/StaffRegister';
import StaffLogin from './pages/StaffLogin';

const logout = () => {
  localStorage.clear();
  window.location = '/';
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      http.get('/user/auth').then((res) => {
        console.log('Fetched user data:', res.data.user);
        setUser(res.data.user);
      }).catch((error) => {
        console.error('Error fetching user data:', error)
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h5" component="div">
                    ECOSWAP
                  </Typography>
                </Link>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                  <Typography variant="h6" component="div">
                    Home
                  </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                {user ? (
                  <>
                    {user.role === 'staff' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link to="/users">
                          <Typography variant="h6" component="div">
                            Users
                          </Typography>
                        </Link>
                        <Link to="/staff">
                          <Typography variant="h6" component="div">
                            Staff
                          </Typography>
                        </Link>
                      </Box>
                    ) : (
                      <Link to="/account">
                        <Typography variant="h6" component="div">
                          Account Info
                        </Typography>
                      </Link>
                    )}
                    <Button onClick={logout}>Logout</Button>
                  </>
                ) : (
                  <>
                    {/* <Link to="/staff-register">
                      <Typography>Staff Register</Typography>
                    </Link> */}
                    <Link to="/register">
                      <Typography>Register</Typography>
                    </Link>
                    <Link to="/login">
                      <Typography>Login</Typography>
                    </Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/staff-register" element={<StaffRegister />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<AccountInfo />} />
              <Route path="/users" element={<Users />} />
              <Route path="/user-edit" element={<UserEdit/>}/>
              <Route path="/set-username" element={<SetUsername />} />
              <Route path="/change-password" element={<Password />} />
              <Route path="/edit-user/:id" element={<EditUser />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/staff-login" element={<StaffLogin />} />
              <Route path="/set-password" element={<SetPassword />}/>
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
