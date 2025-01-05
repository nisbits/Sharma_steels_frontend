import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css"; 

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId } = location.state || {}; // Get order ID from navigation state
  const navigate = useNavigate();

  return (
    <div className="order-success-container">
      <div className="success-message">
        <div className="check-icon">
          {/* You can replace this with an actual check icon image */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            fill="green"
            className="bi bi-check-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.08.022l3.992-4.99a.75.75 0 1 0-1.08-1.04L7.5 9.384 6.03 7.905a.75.75 0 1 0-1.08 1.04l1.5 1.5z" />
          </svg>
        </div>
        <h2>Your transaction has been completed successfully!</h2>
        <p>We have emailed you the details of your order.</p>
        <p>
          <strong>Your order with ID {orderId} has been placed successfully.</strong>
        </p>
        <button onClick={() => navigate("/")} className="back-to-home-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
