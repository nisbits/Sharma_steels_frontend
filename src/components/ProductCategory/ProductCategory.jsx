import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './ProductCategory.css';
import searchImage from '../../Assets/images/search.jpeg';
import cementImage from '../../Assets/images/cement.jpeg';

const ProductCategory = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetch(`http://sharmasteel.in:8080/products/product-listing/catagory/${encodeURIComponent(id)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch products for category ID: ${id}`);
        }
        return response.json();
      })
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(true);
        setProducts([]);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const baseUrl = 'http://sharmasteel.in:8080';

  // Click handler to navigate to product detail page
  const handleProductClick = (productId) => {
    navigate(`/product_detail/${productId}`);
  };

  return (
    <div className="product-category-container">
      <h2><img src={cementImage} alt="Category" />Category {id}</h2>
      <ul className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.product_id} // Use product_id as the unique key
              className="product-list-item"
              onClick={() => handleProductClick(product.product_id)} // Attach click handler
            >
              {product.product_image_main ? (
                <img 
                  src={`${baseUrl}${product.product_image_main}`} 
                  alt={product.brand_name}
                  style={{ maxWidth: '100%', height: 'auto' }} 
                />
              ) : (
                <p>No image available</p>
              )}
              <h3>{product.brand_name}</h3>
              <p>{product.specification}</p>
              <p className="product-price">
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
              </p>
              {product.unit_of_measurement && (
                <p>Unit: {product.unit_of_measurement}</p>
              )}
            </div>
          ))
        ) : (
          <>
            <img src={searchImage} alt="Search" style={{ maxWidth: '100%' }} className='searchImage' />
            <h3>Oops! No Product Found</h3>
          </>
        )}
      </ul>
    </div>
  );
};

export default ProductCategory;
