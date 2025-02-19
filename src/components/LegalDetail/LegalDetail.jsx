import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './LegalDetail.css'
const LegalDetail = () => {
  const { id } = useParams();
  const [legalItem, setLegalItem] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchLegalDetail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/legal/${id}/`);
        setLegalItem(response.data); 
      } catch (error) {
        console.error("Error fetching legal content:", error);
      }
    };

    fetchLegalDetail();
  }, [id, apiUrl]);

  if (!legalItem) return <p>Loading content...</p>;

  return (
    <div className="legal-detail-container">
      <h5>{legalItem.title}</h5>
      <p style={{ whiteSpace: "pre-wrap" }}>{legalItem.content}</p>{" "}
    </div>
  );
};

export default LegalDetail;
