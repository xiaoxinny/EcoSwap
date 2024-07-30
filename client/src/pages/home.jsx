import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Box textAlign="center" mt={5}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to ECOSWAP
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Your one-stop solution for sustainable swapping and trading.
        </Typography>
        <Box mt={4}>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="secondary"
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
