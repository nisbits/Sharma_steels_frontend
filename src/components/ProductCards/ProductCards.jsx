import React, { useState, useEffect } from 'react';
import './ProductCards.css';
import productPlaceholder from '../../Assets/images/lights-89.jpg'; // Fallback image if no image available

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    fetch('http://sharmasteel.in:8080/products/product-listing/Home-page/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data.products || []); // Assuming the API returns an array of products
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
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

  const baseUrl = 'http://sharmasteel.in:8080'; // Base URL for images

  return (
    <div className="product-cards-container">
      {products.map((product, index) => (
        <div key={index} className="product-card">
          <div className="product-image">
            <img 
              src={product.product_image_main ? `${baseUrl}${product.product_image_main}` : productPlaceholder} 
              alt={product.specification} 
              style={{ maxWidth: '100%', height: 'auto' }} // Adjust styling as needed
            />
            {product.discount && <div className="discount-badge">-{product.discount}%</div>}
          </div>
          <div className="product-info">
            <h2>{product.brand_name}</h2>
            <p className="product-title">{product.specification}</p>

            {/* Price Display Logic */}
            <h3 className="product-price">
              {product.discount ? (
                <>
                  ₹{product.selling_price}{' '}
                  {product.mrp && (
                    <span className="old-price" style={{ textDecoration: 'line-through' }}>
                      ₹{product.mrp}
                    </span>
                  )}
                </>
              ) : (
                <>
                  ₹{product.mrp}
                </>
              )}
            </h3>

            {/* Displaying unit information */}
            {product.unit_of_measurement && (
              <p className="product-unit">
                Unit: {product.unit_of_measurement} {/* per bag or kg */}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
