import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/App.css'; 

function Home() {
  const [data, setData] = useState([]);
  const [deleted, setDeleted] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (deleted) {
      setDeleted(false);
      axios.get('/api/events/events')
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [deleted]);

  function handleDelete(id) {
    axios.delete(`/api/events/delete/${id}`)
      .then((res) => {
        setDeleted(true);
      })
      .catch((err) => console.log(err));
  }

  function truncateURL(url, maxLength = 30) {
    if (url.length <= maxLength) {
      return url;
    }
    return url.substring(0, maxLength) + '...';
  }

  function handleSignOut() {

    navigate('/login');
  }

  return (
    <div className='container my-5'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2 className='text-primary'>Event Management</h2>
        <div>
          <Link className='btn btn-success me-2' to='/create'>Add Event</Link>
          <Link className='btn btn-info me-2' to='/customer-view'>View Events</Link>
          <button className='btn btn-danger' onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
      <div className='table-responsive'>
        <table className='table table-hover'>
          <thead className='table-dark'>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Picture URL</th>
              <th>Date</th>
              <th>Speaker</th>
              <th>Sponsors</th>
              <th>Description</th>
              <th>Venue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.title}</td>
                  <td>{truncateURL(event.picture)}</td>
                  <td>{event.date}</td>
                  <td>{event.speaker}</td>
                  <td>{event.sponsors}</td>
                  <td>{event.description}</td>
                  <td>{event.venue}</td>
                  <td>
                    <div className='action-buttons'>
                      <Link className='btn btn-outline-primary btn-sm me-2' to={`read/${event.id}`}>Read</Link>
                      <Link className='btn btn-outline-warning btn-sm me-2' to={`edit/${event.id}`}>Edit</Link>
                      <button onClick={() => handleDelete(event.id)} className='btn btn-outline-danger btn-sm'>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
