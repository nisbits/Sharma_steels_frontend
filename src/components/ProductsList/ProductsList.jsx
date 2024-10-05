import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsList.css';
import cementImage from '../../Assets/images/cement.jpeg';

const ProductsList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Hook to navigate programmatically

  useEffect(() => {
    // Fetch categories from the API
    fetch('http://Sharmasteel.in:8080/products/product-catagory/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        return response.json();
      })
      .then(data => {
        // Access the 'catagories' array in the response
        if (data && Array.isArray(data.catagories)) {
          setCategories(data.catagories);
        } else {
          setError('Unexpected data format');
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`); 
  };

  return (
    <div className="products-container">
      <ul className="products-list">
        {categories.map((category, index) => (
          <li
            key={index}
            className="products-list-item"
            onClick={() => handleCategoryClick(category)}  
          >
            <img src={cementImage} alt={category} />
            <h3>{category}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;