import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Read() {
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/api/events/get_event/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="container-fluid bg-light vh-100">
      <h1>Event Details</h1>
      <Link to="/" className="btn btn-secondary mb-3">Back</Link>
      {data.map((event) => (
        <ul className="list-group" key={event.id}>
          <li className="list-group-item"><b>ID:</b> {event.id}</li>
          <li className="list-group-item"><b>Title:</b> {event.title}</li>
          <li className="list-group-item"><b>Picture:</b> <img src={event.picture}></img> </li>
          <li className="list-group-item"><b>Date:</b> {event.date}</li>
          <li className="list-group-item"><b>Speaker:</b> {event.speaker}</li>
          <li className="list-group-item"><b>Sponsors:</b> {event.sponsors}</li>
          <li className="list-group-item"><b>Description:</b> {event.description}</li>
          <li className="list-group-item"><b>Venue:</b> {event.venue}</li>
        </ul>
      ))}
    </div>
  );
}

export default Read;
