import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import http from '../http';

function TutorialRequest({ tutorialbuyer, tutorialtitle, sellerId }) { // Props received
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      await http.post(`/request`, { tutorialbuyer, tutorialtitle, message, sellerId });
      setSuccess(true);
    } catch (error) {
      console.error('Failed to send request', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Send a Request</Typography>
      <TextField
        label="Message"
        multiline
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={handleRequest}
        disabled={loading}
        fullWidth
      >
        {loading ? 'Sending...' : 'Send Request'}
      </Button>
      {success && <Typography variant="body2" color="success.main">Request sent successfully!</Typography>}
    </Box>
  );
}

export default TutorialRequest;
