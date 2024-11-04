import React, { useState, useEffect } from 'react';
import './ProductCards.css';
import productPlaceholder from '../../Assets/images/lights-89.jpg'; // Fallback image if no image available
import { useNavigate } from 'react-router-dom';

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://sharmasteel.in:8080/products/product-listing/Home-page/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data.products || []);
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

  const handleProductClick = (productId) => {
    navigate(`/product_detail/${productId}`); 
  };
  const baseUrl = 'http://sharmasteel.in:8080'; 

  return (
    <div className="product-cards-container">
      {products.map((product, index) => (
        <div key={index} className="product-card"
        onClick={() => handleProductClick(product.product_id)}>
          <div className="product-image">
            <img 
              src={product.product_image_main ? `${baseUrl}${product.product_image_main}` : productPlaceholder} 
              alt={product.specification} 
              // style={{ maxWidth: '100%', height: 'auto' }} // Adjust styling as needed
            />
           {product.discount !== undefined && product.discount !== null && !isNaN(product.discount) && (
  <div className="discount-badge">
    {Number(product.discount) % 1 === 0
      ? `-${Math.floor(product.discount)}%`
      : `-${Number(product.discount).toFixed(2)}%`}
  </div>
)}

          </div>
          <div className="product-info">
            <h2>{product.brand_name}</h2>
            <p className="product-title">{product.specification}</p>

            {/* Price Display Logic */}
            <h3 className="product-price">
              {product.discount ? (
                <>
                  ₹{product.selling_price}{' '}/{product.unit_of_measurement}
                  {product.mrp && (
                    <span className="old-price" style={{ textDecoration: 'line-through' }}>
                      ₹{product.mrp}/{product.unit_of_measurement}
                    </span>
                  )}
                </>
              ) : (
                <>
                  ₹{product.mrp}/ {product.unit_of_measurement}
                </>
              )}
            </h3>

           
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
