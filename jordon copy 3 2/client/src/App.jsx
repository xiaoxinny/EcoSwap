// App.jsx
import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';
import Rewards from './pages/Rewards';
import TutorialDetails from './pages/TutorialDetails';
import SellerDashboard from './pages/SellerDashboard';
import Request from './pages/Request'; // Import Request

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    EcoSwap
                  </Typography>
                </Link>
                <Box>
                  <Button onClick={handleMenuClick}>
                    <Typography>Listings</Typography>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose} component={Link} to="/tutorials">Listings</MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to="/seller-dashboard">Seller Dashboard</MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to="/requests">Your Requests</MenuItem>
                  </Menu>
                </Box>
                <Link to="/ecopoints"><Typography>EcoPoints</Typography></Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/register"><Typography>Register</Typography></Link>
                    <Link to="/login"><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>
          <Container>
            <Routes>
              <Route path="/" element={<Tutorials />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/addtutorial" element={<AddTutorial />} />
              <Route path="/edittutorial/:id" element={<EditTutorial />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/form" element={<MyForm />} />
              <Route path="/ecopoints" element={<Rewards />} />
              <Route path="/tutorialdetails/:id" element={<TutorialDetails />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/requests" element={<Request />} /> {/* Add Request route */}
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;