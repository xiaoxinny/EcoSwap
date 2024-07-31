import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditTutorial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // State to control dialog visibility

  useEffect(() => {
    http.get(`/tutorial/${id}`).then((res) => {
      setTutorial(res.data);
      setImageFile(res.data.imageFile);
      setLoading(false);
    });
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteTutorial = () => {
    // Show a loading indicator or disable the delete button
    setLoading(true);
  
    // Make an HTTP DELETE request to delete the tutorial
    http.delete(`/tutorial/${id}`)
      .then((response) => {
        console.log("Tutorial deleted successfully:", response.data);
        // Redirect to the tutorials list
        navigate("/tutorials");
      })
      .catch((error) => {
        console.error("Failed to delete tutorial:", error.response || error);
        // Error hndling
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: tutorial,
    enableReinitialize: true,
    validationSchema: yup.object({
      title: yup
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters")
        .required("Title is required"),
      description: yup
        .string()
        .trim()
        .min(3, "Description must be at least 3 characters")
        .max(500, "Description must be at most 500 characters")
        .required("Description is required"),
      category: yup.string().required("Category is required"),
      condition: yup.string().required("Condition is required"),
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.title = data.title.trim();
      data.description = data.description.trim();
      data.category = data.category.trim();
      data.condition = data.condition.trim();
      http.put(`/tutorial/${id}`, data).then((res) => {
        console.log(res.data);
        navigate("/tutorials");
      });
    },
  });

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Tutorial
      </Typography>
      {!loading && (
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={8}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                multiline
                minRows={2}
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.category && Boolean(formik.errors.category)
                  }
                >
                  <MenuItem value="Furniture">Furniture</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Condition</InputLabel>
                <Select
                  label="Condition"
                  name="condition"
                  value={formik.values.condition}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.condition && Boolean(formik.errors.condition)
                  }
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Like New">Like New</MenuItem>
                  <MenuItem value="Used">Used</MenuItem>
                  <MenuItem value="Heavily Used">Heavily Used</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button variant="contained" component="label">
                  Upload Image
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={onFileChange}
                  />
                </Button>
                {imageFile && (
                  <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                    <img
                      alt="tutorial"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                    ></img>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Save Changes
            </Button>
            {/* Delete Button and Dialog */}
            <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
              Delete
            </Button>
          </Box>
        </Box>
      )}

      {/* Dialog for delete confirmation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Tutorial</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tutorial?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteTutorial}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}

export default EditTutorial;