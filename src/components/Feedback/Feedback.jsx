import React from 'react';
import { Link } from 'react-router-dom';
import './Feedback.css'
import { FaAngleRight } from "react-icons/fa";

const Feedback = () => {
  return (
    <div className="feedback-container">
      <h5>Feedback & Information</h5>
<p>
      <Link to="/legal"> Legal Information</Link>
      <FaAngleRight />

      </p>
      <p>
      <Link to="/contact">Contact Info</Link>
      <FaAngleRight />

      </p>
    </div>
  );
};

export default Feedback;
