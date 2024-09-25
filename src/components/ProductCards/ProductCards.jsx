import React from 'react';
import './ProductCards.css';
import productImage from '../../Assets/images/lights-89.jpg'
const ProductCards = () => {
  const products = [
    {
      id: 1,
      image: productImage, // Replace with actual image paths
      discount: '-5%',
      price: '₹3,500.00',
      oldPrice: '₹3,700.00',
      title: 'WPC Doors (75*36inch)',
    },
    {
      id: 2,
      image: productImage,
      discount: '-7%',
      price: '₹2,500.00',
      oldPrice: '₹2,700.00',
      title: 'WPC Doors (72*26inch)',
    },
    {
      id: 3,
      image: productImage,
      price: '₹54.10 – ₹160.50 Per Sq.ft',
      title: 'Century Sainik Plywood 710',
    },
    {
      id: 4,
      image: productImage,
      price: '₹354.00 Per Sft',
      title: 'Veneered Door',
    },
    {
      id: 5,
      image: productImage,
      discount: '-9%',
      price: '₹246.00 Per Sft',
      oldPrice: '₹270.00',
      title: 'Laminated Doors',
    },
  ];

  return (
    <div className="product-cards-container">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            <img src={product.image} alt={product.title} />
            {product.discount && <div className="discount-badge">{product.discount}</div>}
          </div>
          <div className="product-info">
            <h3 className="product-price">
              {product.price}{' '}
              {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
            </h3>
            <p className="product-title">{product.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
