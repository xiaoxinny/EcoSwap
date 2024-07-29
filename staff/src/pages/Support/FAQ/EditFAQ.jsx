import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import http from "../../../http.js";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";

const EditFAQ = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await http.get(`/faqs/${id}`);
        setFaq(response.data); // Set FAQ data from response
      } catch (error) {
        console.error("Error fetching FAQ:", error);
      }
    };

    fetchFAQ();
  }, [id]);

  const validationSchema = Yup.object().shape({
    question: Yup.string().trim().required("Question is required"),
    answer: Yup.string().trim().required("Answer is required"),
    category: Yup.string().trim().required("Category is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await http.put(`/faqs/${id}`, values);
      console.log("FAQ updated:", values);
      navigate("/FAQ");
    } catch (error) {
      console.error("Error updating FAQ:", error);
      setFieldError("submit", "Failed to update FAQ. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      question: faq ? faq.question : "",
      answer: faq ? faq.answer : "",
      category: faq ? faq.category : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: handleSubmit,
  });

  if (!faq) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1 className="pt-5 pb-3">Edit FAQ</h1>
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
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            sx={{ mb: 3 }}
            id="category"
            name="category"
            label="Category"
            labelId="category-label"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.category && Boolean(formik.errors.category)}
          >
            <MenuItem value={"General"}>General</MenuItem>
            <MenuItem value={"Listings"}>Listings</MenuItem>
            <MenuItem value={"Violations and Appeal"}>Violations and Appeal</MenuItem>
            <MenuItem value={"Events"}>Events</MenuItem>
            <MenuItem value={"Support"}>Support</MenuItem>
          </Select>
          {formik.touched.category && formik.errors.category && (
            <Typography color="error" sx={{ mb: 3 }}>
              {formik.errors.category}
            </Typography>
          )}
        </FormControl>

        {formik.errors.submit ? (
          <Typography color="error" sx={{ mb: 3 }}>
            {formik.errors.submit}
          </Typography>
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
          {formik.isSubmitting ? "Updating..." : "Update FAQ"}
        </Button>
        <Button
          component={Link}
          to="/faqs"
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "darkgrey",
            },
          }}
        >
          Cancel
        </Button>
      </form>
    </Container>
  );
};

export default EditFAQ;
