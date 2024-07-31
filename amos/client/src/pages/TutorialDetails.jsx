
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import dayjs from 'dayjs';
import http from "../http";
import '../TutorialDetails.css';

function TutorialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    imageFile: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/tutorial/${id}`).then((res) => {
      setTutorial(res.data);
      setLoading(false);
    });
  }, [id]);

  const calculateAge = (createdAt) => {
    const now = dayjs();
    const createdDate = dayjs(createdAt);
    return now.diff(createdDate, 'day'); // Calculate the difference in days
  };

  return (
    <Box className="page-container">
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} className="paper-container">
          <Box className="relative-box">
            {tutorial.imageFile && (
              <img
                alt="tutorial"
                src={`${import.meta.env.VITE_FILE_BASE_URL}${tutorial.imageFile}`}
                className="tutorial-image"
              />
            )}
          </Box>
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6" className="bold-typography">
              {tutorial.title}
            </Typography>
            <Grid container spacing={1} className="grid-container">
              <Grid item>
                <FiberNewIcon fontSize="small" />
                <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>{tutorial.condition}</Typography>
              </Grid>
              <Grid item>
                <ViewModuleIcon fontSize="small" />
                <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>{tutorial.category}</Typography>
              </Grid>
              <Grid item>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>Placeholder Location</Typography>
              </Grid>
            </Grid>
            <Button variant="contained" fullWidth className="request-button">
              Request
            </Button>
            <Typography variant="body2" className="gray-typography">
            </Typography>
            <Typography variant="body2">
              Description:
              <br />
              {tutorial.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Created {calculateAge(tutorial.createdAt)} days ago
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default TutorialDetails;