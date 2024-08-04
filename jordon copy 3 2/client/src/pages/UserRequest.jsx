import React, { useState, useEffect, useContext } from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function UserRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext); // Get current user from context

  useEffect(() => {
    const fetchRequests = async () => {
      if (user && user.id) {
        try {
          const res = await http.get(`/request/buyer/${user.id}`); // Fetch requests for the current buyer
          setRequests(res.data);
        } catch (error) {
          console.error('Failed to fetch requests', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRequests();
  }, [user]);

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {requests.map((request) => (
            <ListItem key={request.id}>
              <ListItemText
                primary={`Tutorial: ${request.tutorialtitle}`}
                secondary={`Message: ${request.message} \nFrom: ${request.tutorialbuyer}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default UserRequest;
