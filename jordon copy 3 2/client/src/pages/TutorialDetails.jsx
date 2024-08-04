import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField
} from "@mui/material";
import {
  AccountCircle,
} from "@mui/icons-material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import dayjs from 'dayjs';
import http from "../http";
import '../TutorialDetails.css';
import TutorialRequest from './TutorialRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

const CHARACTER_LIMIT = 200;

function TutorialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Get current user from context
  const [tutorial, setTutorial] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    imageFile: "",
    createdAt: "",
    userId: "", // Add userId to the state
    user: { name: "" } // Initialize the user object
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

  const isOwner = user && user.id === tutorial.userId;

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
            {!isOwner && (
              <TutorialRequest
                tutorialbuyer={user.name}
                tutorialtitle={tutorial.title}
                sellerId={tutorial.userId}
              />
            )}
            <Box
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
              color="text.secondary"
            >
              <AccountCircle sx={{ mr: 1 }} />
              <Typography>{tutorial.user?.name}</Typography>
            </Box>
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
