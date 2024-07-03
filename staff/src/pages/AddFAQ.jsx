import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import http from "../http.js";
import { Link, useNavigate } from "react-router-dom";

const AddFAQs = () => {
  const navigate = useNavigate();

  const initialValues = {
    question: "",
    answer: ""
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().trim().required("Question is required"),
    answer: Yup.string().trim().required("Answer is required")
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

  return (
    <div className="container">
      <h1 className="pt-5 pb-3">Add FAQ</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="question" className="form-label">
                Question
              </label>
              <Field
                type="text"
                className="form-control"
                id="question"
                name="question"
              />
              <ErrorMessage
                name="question"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="answer" className="form-label">
                Answer
              </label>
              <Field
                as="textarea"
                className="form-control"
                id="answer"
                name="answer"
                rows="3"
              />
              <ErrorMessage
                name="answer"
                component="div"
                className="text-danger"
              />
            </div>
            <ErrorMessage name="submit" component="div" className="alert alert-danger" />
            <button type="submit" className="btn btn-primary me-2" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add FAQ"}
            </button>
            <Link to="/faqs" className="btn btn-secondary">
              Cancel
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddFAQs;
