import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Edit() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/get_event/${id}`)
      .then((res) => {
        setData(res.data[0] || {});
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch event data.");
        setLoading(false);
        console.log(err);
      });
  }, [id]);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
  
    axios.post(`http://localhost:5000/api/events/edit_user/${id}`, data)
      .then(() => navigate("/"))
      .catch((err) => {
        console.error("Failed to save event data", err);
        setError("Failed to save event data.");
      });
  }
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid bg-light vh-100">
      <h1>Edit Event {id}</h1>
      <Link to="/" className="btn btn-secondary mb-3">Back</Link>
      <form onSubmit={handleSubmit}>
        {Object.keys(data).map((key) => (
          key !== 'id' && (
            <div className="form-group my-3" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type="text"
                name={key}
                id={key}
                className="form-control"
                value={data[key] || ''}
                onChange={handleChange}
              />
            </div>
          )
        ))}
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

export default Edit;
