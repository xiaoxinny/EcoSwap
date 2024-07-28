import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import http from "../../../http.js";
import { Link, useParams, useNavigate } from "react-router-dom";

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

  const initialValues = {
    question: faq ? faq.question : "",
    answer: faq ? faq.answer : ""
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().trim().required("Question is required"),
    answer: Yup.string().trim().required("Answer is required")
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

  if (!faq) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="container">
      <h1 className="pt-5 pb-3">Edit FAQ</h1>
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
              {isSubmitting ? "Updating..." : "Update FAQ"}
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

export default EditFAQ;
