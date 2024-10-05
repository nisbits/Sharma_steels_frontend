import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductCategory.css';

const categoryMap = {
  'Stone Chips': 'Stone-Chips',    // Map the route name to the API expected name
  'Ring(Churi)': 'Ring(Churi)',    // No change needed, API expects this
  // Add more mappings if necessary
};

const ProductCategory = () => {
  const { categoryName } = useParams(); // Get category name from URL params
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Map the URL category name to the API expected category name
    const apiCategoryName = categoryMap[categoryName] || categoryName; 
    console.log(`Fetching products for category: ${apiCategoryName}`);

    // Fetch products for the specific category using the updated API endpoint
    fetch(`http://sharmasteel.in:8080/products/product-listing/catagory/${encodeURIComponent(apiCategoryName)}`)
      .then(response => {
        console.log('API response status:', response.status); // Log the response status
        if (!response.ok) {
          throw new Error(`Failed to fetch products for category: ${apiCategoryName}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data); // Log the fetched data
        setProducts(data.products || []); // Set the products array from the response
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Log any errors
        setError(error.message);
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const baseUrl = 'http://sharmasteel.in:8080'; 

  return (
    <div className="product-category-container">
      <h2>Products in {categoryName}</h2>
      <ul className="product-list">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="product-list-item">
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

              {/* Price Display Logic */}
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

              {/* Displaying unit information */}
              {product.unit_of_measurement && (
                <p>Unit: {product.unit_of_measurement} {/* per bag or kg */}</p>
              )}
            </div>
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </ul>
    </div>
  );
};

export default ProductCategory;
