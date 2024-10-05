import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductCategory.css';
import searchImage from '../../Assets/images/search.jpeg'
import cementImage from '../../Assets/images/cement.jpeg';
const categoryMap = {
  'Stone Chips': 'Stone-Chips',    
  'Ring(Churi)': 'Ring(Churi)',   

};

const ProductCategory = () => {
    const { categoryName } = useParams(); 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const apiCategoryName = categoryMap[categoryName] || categoryName; 
      console.log(`Fetching products for category: ${apiCategoryName}`);
  
      fetch(`http://sharmasteel.in:8080/products/product-listing/catagory/${encodeURIComponent(apiCategoryName)}`)
        .then(response => {
          console.log('API response status:', response.status); 
          if (!response.ok) {
            throw new Error(`Failed to fetch products for category: ${apiCategoryName}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched data:', data); 
          setProducts(data.products || []); 
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error); 
          setError(true); 
          setProducts([]); 
          setLoading(false);
        });
    }, [categoryName]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    const baseUrl = 'http://sharmasteel.in:8080'; 
  
    return (
      <div className="product-category-container">
        <h2><img src={cementImage} />{categoryName}</h2>
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