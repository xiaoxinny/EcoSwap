import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  AccountCircle,
  AccessTime,
  Search,
  Clear,
  Edit,
} from "@mui/icons-material";
import http from "../http";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import global from "../global";

function Tutorials() {
  const [tutorialList, setTutorialList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tutorialsPerPage, setTutorialsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { user } = useContext(UserContext);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getTutorials = () => {
    let query = `/tutorial?page=${currentPage}&limit=${tutorialsPerPage}`;
    if (categoryFilter) query += `&category=${categoryFilter}`;
    if (conditionFilter) query += `&condition=${conditionFilter}`;
    http.get(query).then((res) => {
      setTutorialList(res.data.tutorials);
      setTotalItems(res.data.totalTutorials);
    });
  };

  const searchTutorials = () => {
    http.get(`/tutorial?search=${search}`).then((res) => {
      setTutorialList(res.data.tutorials);
      setTotalItems(res.data.totalTutorials);
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, conditionFilter]);

  useEffect(() => {
    getTutorials();
  }, [currentPage, tutorialsPerPage, categoryFilter, conditionFilter]);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchTutorials();
    }
  };

  const onClickSearch = () => {
    searchTutorials();
  };

  const onClickClear = () => {
    setSearch("");
    getTutorials();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Tutorials
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Input
          value={search}
          placeholder="Search"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <Link to="/addtutorial">
            <Button variant="contained">Add</Button>
          </Link>
        )}
        {/* Category Filter */}
        <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value=""> </MenuItem>
            <MenuItem value="Furniture">Furniture</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </FormControl>
        {/* Condition Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Condition</InputLabel>
          <Select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value=""> </MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Like New">Like New</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
            <MenuItem value="Heavily Used">Heavily Used</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        {tutorialList.map((tutorial, i) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={tutorial.id}>
              <Link
                to={`/tutorialdetails/${tutorial.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card>
                  {tutorial.imageFile && (
                    <Box className="aspect-ratio-container">
                      <img
                        alt="tutorial"
                        src={`${import.meta.env.VITE_FILE_BASE_URL}${
                          tutorial.imageFile
                        }`}
                      ></img>
                    </Box>
                  )}
                  <CardContent>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {tutorial.title}
                      </Typography>
                      {user && user.id === tutorial.userId && (
                        <Link to={`/edittutorial/${tutorial.id}`}>
                          <IconButton color="primary" sx={{ padding: "4px" }}>
                            <Edit />
                          </IconButton>
                        </Link>
                      )}
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      color="text.secondary"
                    >
                      <AccountCircle sx={{ mr: 1 }} />
                      <Typography>{tutorial.user?.name}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      color="text.secondary"
                    >
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(tutorial.createdAt).format(
                          global.datetimeFormat
                        )}
                      </Typography>
                    </Box>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {tutorial.description}
                    </Typography>
                    {/* Displaying Category and Condition */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Category: {tutorial.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Condition: {tutorial.condition}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography sx={{ margin: "0 10px", lineHeight: "36px" }}>
          Page {currentPage}
        </Typography>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalItems / tutorialsPerPage)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default Tutorials;
