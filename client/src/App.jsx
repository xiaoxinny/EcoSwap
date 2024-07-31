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
import StaffEdit from './pages/StaffEdit';
import Password from './pages/ChangePassword';
import EditUser from './pages/EditUser';
import Staff from './pages/Staff';
import StaffInfo from './pages/StaffProfile';
import UserContext from './contexts/UserContext';
import http from './http';
import StaffLogin from './pages/StaffLogin';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Rewards from './pages/Rewards';
import TutorialDetails from './pages/TutorialDetails';
import StaffRegister from './pages/StaffRegister'

const logout = () => {
  localStorage.clear();
  window.location = '/';
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      http.get('/user/auth')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="h5">ECOSWAP</Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                {user ? (
                  <>
                    {user.role === 'staff' ? (
                      <>
                        <Link to="/StaffRegister" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                          <Typography variant="h6">Create Staff</Typography>
                        </Link>
                        <Link to="/users" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                          <Typography variant="h6">Users</Typography>
                        </Link>
                        <Link to="/staff" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                          <Typography variant="h6">Staff</Typography>
                        </Link>
                        <Link to="/staff-info" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                          <Typography variant="h6">Staff Info</Typography>
                        </Link>

                      </>
                    ) : (
                      <>
                        <Link to="/tutorials" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                          <Typography variant="h6">Tutorials</Typography>
                        </Link>
                        <Link to="/ecopoints" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                          <Typography variant="h6">EcoPoints</Typography>
                        </Link>
                        <Link to="/account" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                          <Typography variant="h6">Account Info</Typography>
                        </Link>
                      </>
                    )}
                    <Button onClick={logout} color="inherit" style={{ marginLeft: '16px' }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/register" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                      <Typography variant="h6">Register</Typography>
                    </Link>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '16px' }}>
                      <Typography variant="h6">Login</Typography>
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
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<AccountInfo />} />
              <Route path="/users" element={<Users />} />
              <Route path="/user-edit" element={<UserEdit />} />
              <Route path="/set-username" element={<SetUsername />} />
              <Route path="/change-password" element={<Password />} />
              <Route path="/edit-user/:id" element={<EditUser />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/staff-login" element={<StaffLogin />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/staff-info" element={<StaffInfo />} />
              <Route path="/staff-edit" element={<StaffEdit />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/addtutorial" element={<AddTutorial />} />
              <Route path="/edittutorial/:id" element={<EditTutorial />} />
              <Route path="/form" element={<MyForm />} />
              <Route path="/ecopoints" element={<Rewards />} />
              <Route path="/tutorialdetails/:id" element={<TutorialDetails />} />
              <Route path="/StaffRegister" element={<StaffRegister />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
