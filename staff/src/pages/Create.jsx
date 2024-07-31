import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Create() {
  const [values, setValues] = useState({
    title: '',
    picture: '',
    date: '',
    speaker: '',
    sponsors: '',
    description: '',
    venue: ''
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios.post('/api/events/add', values)
      .then(() => navigate('/'))
      .catch((err) => console.log(err));
  }

  return (
    <div className="container-fluid bg-light vh-100">
      <h3>Add Event</h3>
      <Link to="/" className="btn btn-secondary mb-3">Back</Link>
      <form onSubmit={handleSubmit}>
        {Object.keys(values).map((key) => (
          <div className="form-group my-3" key={key}>
            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type="text"
              name={key}
              id={key}
              className="form-control"
              value={values[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

export default Create;
