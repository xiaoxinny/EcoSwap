import React, { useState, useMemo } from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/base.css";
import logo_circle from "../assets/logo-circular.png";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMediaQuery, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReportIcon from '@mui/icons-material/Report';
import QuizIcon from '@mui/icons-material/Quiz';
import GavelIcon from '@mui/icons-material/Gavel';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Link as MuiLink,
} from "@mui/material";

const drawerWidth = 240;

function Layout() {
  // For keeping track of open state
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // For keeping track of close state
  const [isClosing, setIsClosing] = React.useState(false);
  // For state of light and dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Handles closing of drawer
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  // Handles transition end of drawer
  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  // Handles toggling of drawer, checking if its closing and then choosing to open or close
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  // Remembers the theme of the page, only to change when darkMode changes from false to true or vice versa
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Array of icons for iterating
  const icons = [
    <DashboardIcon key="DashboardIcon" />,
    <AccountCircleIcon key="AccountsIcon" />,
    <ReportIcon key="ViolationIcon" />,
    <GavelIcon key="AppealsIcon" />,
    <QuizIcon key="FAQIcon" />,
    <SupportAgentIcon key="LiveSupportIcon" />,
  ];

  // For repeated printing of options in navbar
  const drawer = (
    <div>
      <Link to="/" id="logo-link"><img src={logo_circle} alt="logo" id="circle-logo" /></Link>
      <List>
        {["Dashboard", "Accounts", "Violations",  "Appeals", "FAQ", "Live Support"].map(
          (text, index) => (
            <ListItem 
            component={MuiLink, Link} 
            key={text} 
            to={`/${text.replace(/\s+/g, '-').toLowerCase()}`}
            sx={{
              textDecoration: 'none',
              color: 'inherit' 
            }}>
              <ListItemButton>
                <ListItemIcon>
                  {icons[index % icons.length]}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        {/* Navbar for right display page */}

        <AppBar
        color="default"
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            display: { xs: "block", sm: "none" }
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Left nav */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* Nav when screen is smaller */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, 
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              },
            }}
          >
            {drawer}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                mb: 2,
              }}
            >
              <Avatar
                alt="profile picture"
                src={logo_circle}
                sx={{ border: "1px solid black", borderRadius: "50%", mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1">Username</Typography>
                <Typography variant="body2" color="textSecondary">
                  Role
                </Typography>
              </Box>
              <IconButton onClick={toggleDarkMode} sx={{ ml: 1 }}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          </Drawer>

          {/* Nav when screen is larger */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "none",
              },
            }}
            open
          >
            {/* Drawer content */}
            {drawer}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                mb: 2,
              }}
            >
              <Avatar
                alt="profile picture"
                src={logo_circle}
                sx={{ border: "1px solid black", borderRadius: "50%", mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1">Username</Typography>
                <Typography variant="body2" color="textSecondary">
                  Role
                </Typography>
              </Box>
              <IconButton onClick={toggleDarkMode} sx={{ ml: 1 }}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          </Drawer>
        </Box>

        {/* Main content for right side */}
        {/* This is for when the screen si at full size */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            display: { xs: "none", sm: "block" },
            backgroundColor: "#f0f0f0",
            boxShadow: "inset 0 0 10px #e0e0e0",
          }}
        >
          <Outlet />
        </Box>
        
        {/* This is for when the screen is at smaller size */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            display: { xs: "block", sm: "none" },
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Layout;
