import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsList.css";
import cementImage from "../../Assets/images/cement.jpeg";

const ProductsList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://Sharmasteel.in:8080/products/product-catagory/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.catagories)) {
          setCategories(data.catagories);
        } else {
          setError("Unexpected data format");
        }
        setLoading(false);
      })
      .catch((error) => {
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
    navigate(`/category/${category.id}`, {
      state: { categoryName: category.catagory },
    });
    
  };

  // const handleCategoryClick = (category) => {
  //   navigate(`/category/${category.id}`);

  // };

  return (
    <div className="products-container">
      <ul className="products-list">
        {categories.map((category) => (
          <li
            key={category.id} // Use a unique ID
            className="products-list-item"
            onClick={() => handleCategoryClick(category)}
          >
            <img
              src={
                category.catagory_image
                  ? `http://Sharmasteel.in:8080${category.catagory_image}`
                  : cementImage
              }
              alt={category.catagory || "Category"}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <h3>{category.catagory || "Unnamed Category"}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
