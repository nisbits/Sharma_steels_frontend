import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import "./ProductCategory.css";
import searchImage from "../../Assets/images/search.jpeg";
import cementImage from "../../Assets/images/cement.jpeg";

const ProductCategory = ({}) => {
  const { id } = useParams();
  const location = useLocation(); // Get the state from the navigation  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  const [products, setProducts] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;
  // const completeUrl = `${apiUrl}/products/product-listing/catagory/${encodeURIComponent(
  //   id
  // )}`;
  // console.log("completeUrl======================", completeUrl);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/products/product-listing/catagory/${encodeURIComponent(id)}/`);
        console.log("Raw Response=============", response);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products for category ID: ${id}`);
        }
  
        const data = await response.json();
        console.log("Parsed Data from API=============", data);
        
        setProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
        setProducts([]);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  const baseUrl = `${apiUrl}`;

  const handleProductClick = (productId) => {
    navigate(`/product_detail/${productId}`);
  };

  return (
    <div className="product-category-container">
      {/* {console.log("Category Name ===>>>", location.state?.categoryName)} */}
      <h2>
        <img src={cementImage} alt="Category" />
        {location.state?.categoryName}
      </h2>
      <ul className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.product_id}
              className="product-list-item"
              onClick={() => handleProductClick(product.product_id)}
            >
              {product.product_image_main ? (
                <img
                  src={`${baseUrl}${product.product_image_main}`}
                  alt={product.brand_name}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              ) : (
                <p>No image available</p>
              )}
              <h3>{product.brand_name}</h3>
              <p>{product.specification}</p>
              <p className="product-price">
                {product.discount ? (
                  <>
                    ₹{product.selling_price}/{product.unit_of_measurement}{" "}
                    {product.mrp && (
                      <span
                        className="old-price"
                        style={{ textDecoration: "line-through" }}
                      >
                        ₹{product.mrp}/{product.unit_of_measurement}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    ₹{product.mrp}/{product.unit_of_measurement}
                  </>
                )}
              </p>
            </div>
          ))
        ) : (
          <>
            <img
              src={searchImage}
              alt="Search"
              style={{ maxWidth: "100%" }}
              className="searchImage"
            />
            <h3>Oops! No Product Found</h3>
          </>
        )}
      </ul>
    </div>
  );
};

export default ProductCategory;
