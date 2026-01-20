import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyDetails.css";

const MyDetails = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("accessToken");

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!token) {
        setError("You must be logged in to view your details.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/user-accounts/mydetails/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDetails(response.data);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [apiUrl, token]);

  if (loading) {
    return <div className="details-container">Loading...</div>;
  }

  if (error) {
    return <div className="details-container error">{error}</div>;
  }

  return (
    <div className="details-container">
      <h2>My Details</h2>
      {details ? (
        <div className="details-card">
          <p><strong>First Name:</strong> {details.user?.first_name || "N/A"}</p>
          <p><strong>Last Name:</strong> {details.user?.last_name || "N/A"}</p>
          <p><strong>Username:</strong> {details.user?.username || "N/A"}</p>
          <p><strong>Email:</strong> {details.user?.email || "N/A"}</p>
          <p><strong>Phone Number:</strong> {details.phone_number || "N/A"}</p>
          <p><strong>Address:</strong> {details.address || "N/A"}</p>
          <p><strong>User Category:</strong> {details.user_catagory || "N/A"}</p>
          <p><strong>Admin Approved:</strong> {details.admin_approved ? "Yes" : "No"}</p>
          <p><strong>Contractor Code:</strong> {details.contractor_code || "N/A"}</p>
        </div>
      ) : (
        <p>No details found.</p>
      )}
    </div>
  );
};

export default MyDetails;
