import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "../../../http.js";
import { Link, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";

const AddFAQ = () => {
  const navigate = useNavigate();

  const initialValues = {
    question: "",
    answer: "",
    category: "",
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().trim().required("Question is required"),
    answer: Yup.string().trim().required("Answer is required"),
    category: Yup.string().trim().required("Category is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await http.post("/faqs", values);
      console.log("FAQ added:", response.data);
      navigate("/FAQ");
    } catch (error) {
      console.error("Error adding FAQ:", error);
      setFieldError("submit", "Failed to add FAQ. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Container>
      <h1 className="pt-5 pb-3">Add FAQ</h1>

      <form onSubmit={formik.handleSubmit}>
        <FormControl fullWidth>
          <TextField
            sx={{ mb: 3 }}
            id="question"
            name="question"
            label="Question"
            value={formik.values.question}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={formik.touched.question && formik.errors.question}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            sx={{ mb: 3 }}
            multiline
            rows={4}
            id="answer"
            name="answer"
            label="Answer"
            value={formik.values.answer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.answer && Boolean(formik.errors.answer)}
            helperText={formik.touched.answer && formik.errors.answer}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="select-label">Option</InputLabel>
          <Select
            sx={{ mb: 3 }}
            id="category"
            name="category"
            label="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
            
          >
            <MenuItem value={"General"}>General</MenuItem>
            <MenuItem value={"Listings"}>Listings</MenuItem>
            <MenuItem value={"Violations and Appeal"}>Violations and Appeal</MenuItem>
            <MenuItem value={"Events"}>Events</MenuItem>
            <MenuItem value={"Support"}>Support</MenuItem>
          </Select>
        </FormControl>

        {formik.errors.submit ? (
          <Typography color="error"
          sx={{
            mb: 3,
          }}>{formik.errors.submit}</Typography>
        ) : null}

        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "darkgrey",
            },
            mr: 2,
          }}
        >
          Add FAQ
        </Button>
        <Button
          type="reset"
          variant="contained"
          onClick={formik.handleReset}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "darkgrey",
            },
          }}
        >
          Reset
        </Button>
      </form>
    </Container>
  );
};

export default AddFAQ;
