import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Contact.css'

const Contact = () => {
  const { id } = useParams();
  const [contactItem, setContactItem] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchContactDetail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/contactus/contact-info/`);
        setContactItem(response.data);
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContactDetail();
  }, [id, apiUrl]);

  if (!contactItem) return <p>Loading content...</p>;

  return (
    <div className="contact-detail-container">
      <h5>Contact Details</h5>
      <div>
        <p><strong>Owner Name:</strong> {contactItem.owner_name}</p>
        <p><strong>Phone Number:</strong> {contactItem.phone_number}</p>
        <p><strong>Email:</strong> {contactItem.email}</p>
        <p><strong>Address:</strong> {contactItem.address}</p>
        <p><strong>Last Updated:</strong> {new Date(contactItem.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Contact;
