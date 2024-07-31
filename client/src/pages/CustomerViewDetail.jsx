import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CustomerViewDetail.css';

function CustomerViewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    axios.get(`/api/events/get_event/${id}`)
      .then((res) => {
        setEvent(res.data[0]); 
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleBookClick = () => {
    setShowBookingModal(true);
  };

  const handleModalClose = () => {
    setShowBookingModal(false);
  };

  const handleConfirmBooking = () => {
    setShowBookingModal(false);
    alert("Booking confirmed!");
  };

  const handleBackClick = () => {
    navigate('/customer-view');
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="customer-view-detail">
      <button onClick={handleBackClick} className="back-btn">Back to Events</button>
      <div className="detail-container">
        <div className="event-image">
          <img src={event.picture} alt={event.title} />
        </div>
        <div className="event-details">
          <h1>{event.title}</h1>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Speaker:</strong> {event.speaker}</p>
          <p><strong>Sponsors:</strong> {event.sponsors}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p className="description"><strong>Description:</strong> {event.description}</p>
          <button onClick={handleBookClick} className="book-btn">Book</button>
        </div>
      </div>

      {showBookingModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <h2>Are you sure you want to book for the following event:</h2>
            <p><strong>{event.title}</strong></p>
            <div className="modal-buttons">
              <button onClick={handleModalClose} className="cancel-btn">Cancel</button>
              <button onClick={handleConfirmBooking} className="confirm-btn">Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerViewDetail;
