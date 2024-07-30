import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerView.css';

function CustomerView() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/events/events')
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleSignOut() {

    navigate('/login');
  }

  return (
    <div className="customer-view-container">
      <button className="btn btn-danger sign-out-button" onClick={handleSignOut}>Sign Out</button> {/* Placeholder, Replace with Navigation Bar */}
      <div>
        <h1>  </h1>
      </div>
      <header className="landing-page-header">
        <div className="landing-page-content">
          
          <h1>Find an event that calls out to you</h1>
          <p>Join EcoSwap's Initiative and meet others like you and have an inside look onto how we work.</p>
        </div>
      </header>
      <div className="upcoming-events-title">
        <h2>Upcoming Events</h2>
      </div>
      <div className="customer-view-events">
        {events.map((event) => (
          <div className="customer-view-event" key={event.id}>
            <div className="event-info">
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p><b>Date:</b> {event.date}</p>
              <Link className="details-link" to={`/customer-view/${event.id}`}>View Details</Link>
            </div>
            <div className="event-image">
              <img src={event.picture} alt={event.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerView;
