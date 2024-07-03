import React, { useEffect, useState } from "react";
import http from "../http.js"; 
import { Link } from "react-router-dom";

function FAQ() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    http.get('/faqs')
        .then((res) => { 
            console.log(res.data);
            setFaqs(res.data);
        });
    }, []);

  const handleDelete = async (id) => {
    try {
      await http.delete(`/faqs/${id}`); 
      setFaqs(faqs.filter((faq) => faq.id !== id));
      console.log(`FAQ with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting FAQ with ID ${id}:`, error);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="pt-5 pb-3">FAQ Management</h1>
      <div className="border border-dark-subtle rounded px-3 py-2">
        <Link to="/add-faq" className="btn btn-primary mb-3">
          Add FAQ
        </Link>
        <table className="table table-white table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Question</th>
              <th scope="col">Answer</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {faqs.map((faq, index) => (
              <tr key={faq.id}>
                <th scope="row">{index + 1}</th>
                <td>{faq.question}</td>
                <td>{faq.answer}</td>
                <td>
                  <Link to={`/edit-faq/${faq.id}`} className="btn btn-sm btn-primary me-2">
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(faq.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FAQ;
