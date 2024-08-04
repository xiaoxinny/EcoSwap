import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';

const SellerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const { user } = useContext(UserContext); // Get current user from context

  useEffect(() => {
    const fetchRequests = async () => {
      if (user && user.id) {
        try {
          const response = await http.get(`/request/seller/${user.id}`); // Fetch requests for the current seller
          if (Array.isArray(response.data)) {
            setRequests(response.data);
          } else {
            console.error('Response data is not an array:', response.data);
            setRequests([]);
          }
        } catch (error) {
          console.error('Error fetching requests:', error);
          setRequests([]);
        }
      }
    };

    fetchRequests();
  }, [user]);

  const handleDecline = async (id) => {
    const confirmed = window.confirm('Are you sure you want to decline this request?');
    if (confirmed) {
      try {
        await http.delete(`/request/${id}`);
        setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
        console.log(`Request ${id} declined.`);
      } catch (error) {
        console.error('Error declining request:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4">Seller Dashboard</Typography>
      {requests.length === 0 ? (
        <Typography>No requests available</Typography>
      ) : (
        requests.map((request) => (
          <Box key={request.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <Typography variant="h6">Product: {request.tutorialtitle}</Typography>
            <Typography>From: {request.tutorialbuyer}</Typography>
            <Typography>Message: {request.message}</Typography>
            <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
              Accept
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDecline(request.id)}>
              Decline
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default SellerDashboard;
