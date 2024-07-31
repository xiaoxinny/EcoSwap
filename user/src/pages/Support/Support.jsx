import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Container,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  InputBase,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress, // Import CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "@mui/icons-material/Help";
import AssistantIcon from "@mui/icons-material/Assistant";
import ForumIcon from "@mui/icons-material/Forum";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import supportMain from "../../assets/support-main.png";
import "../../styles/support.css";
import http from "../../http.js";

function Support() {
  const [faqs, setFaqs] = useState([]); // Initialize as an empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    const fetchFAQ = async () => {
      setLoading(true); // Start loading
      try {
        const response = await http.get(`/faqs`);
        if (Array.isArray(response.data)) {
          setFaqs(response.data); // Set FAQ data from response
        } else {
          setFaqs([]); // Ensure faqs is an array
        }
      } catch (error) {
        console.error("Error fetching FAQ:", error);
        setFaqs([]); // Ensure faqs is an array in case of error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFAQ();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true); // Start loading
      const results = faqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaqs(results);
      setLoading(false); // Stop loading
    } else {
      setFilteredFaqs([]);
      setLoading(false); // Ensure loading is stopped if no search query
    }
  }, [searchQuery, faqs]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <img
              src={supportMain}
              alt="placeholder"
              id="support-main"
              className="responsive-image"
            />
            <h1>We are here to help.</h1>
            <p>
              Our support team is available 24/7 to help you with any issues you
              may encounter.
            </p>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                position: "sticky",
                top: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <h1>Jump to Section</h1>
              <List component="nav">
                <ListItem component="a" href="#FAQs">
                  <HelpIcon />
                  <ListItemText
                    primary="Frequently Asked Questions"
                    sx={{ pl: 1 }}
                  />
                </ListItem>
                <ListItem component="a" href="#Chatbot">
                  <AssistantIcon />
                  <ListItemText primary="About the Chatbot" sx={{ pl: 1 }} />
                </ListItem>
                <ListItem component="a" href="#LiveChat">
                  <ForumIcon />
                  <ListItemText primary="About Live Chat" sx={{ pl: 1 }} />
                </ListItem>
                <ListItem component="a" href="#Email">
                  <SendIcon />
                  <ListItemText primary="Reach Out to Us!" sx={{ pl: 1 }} />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <div id="FAQs">
              <h1>Frequently Asked Questions</h1>
              <p>Have questions? We have answers!</p>
              <p>
                Check out our FAQs to see if your question has already been
                answered.
              </p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h1>Search</h1>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search your query here"
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <IconButton type="button" sx={{ p: "10px" }}>
                <SearchIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper>
            {loading ? (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : filteredFaqs.length > 0 ? (
              <Box
                sx={{
                  mt: 2,
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                <div>
                  {filteredFaqs.map((faq) => (
                    <Accordion key={faq.id}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${faq.id}-content`}
                        id={`panel-${faq.id}-header`}
                      >
                        <Typography>{faq.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography>No results found.</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            
          </Grid>
          <Grid item xs={12}>
            <div id="Chatbot">
              <h1>Introducing, GiBot.</h1>
              <Item>TODO: Implement Chatbot here</Item>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div id="LiveChat">
              <h1>Chat with us now!</h1>
              <Item>Livechat </Item>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div id="Email">
              <h1>Still have questions? Leave us your query!</h1>
              <Item>TODO: Implement Mapbox API with form here</Item>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Support;
