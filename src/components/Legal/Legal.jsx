import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Legal.css'
import { FaAngleRight } from "react-icons/fa";

const Legal = () => {
  const [legalContent, setLegalContent] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchLegalContent = async () => {
      try {
        const response = await axios.get(`${apiUrl}/legal/`);
        setLegalContent(response.data);
      } catch (error) {
        console.error("Error fetching legal content:", error);
      }
    };

    fetchLegalContent();
  }, [apiUrl]);

  return (
    <div className="legal-container">
      <h5>Legal Information</h5>
      {legalContent.length > 0 ? (
        legalContent.map((item) => (
          <div key={item.id} className="legal-item">
            <Link to={`/legal/${item.id}`}>{item.title}</Link>
            <FaAngleRight />

          </div>
        ))
      ) : (
        <p>Loading legal content...</p>
      )}
    </div>
  );
};

export default Legal;
