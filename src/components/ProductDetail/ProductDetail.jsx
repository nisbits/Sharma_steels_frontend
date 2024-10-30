import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios.get(`http://sharmasteel.in:8080/products/product-details/13`)
            .then(response => {
                const productData = response.data.product;
                setProduct(productData);
                setQuantity(productData.minimum_order_quantity || 1); // Set initial quantity to minimum order quantity
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }, [productId]);

    // Increase quantity
    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    // Decrease quantity (ensuring it doesn't go below the minimum order quantity)
    const decreaseQuantity = () => {
        setQuantity(prevQuantity => 
            prevQuantity > product.minimum_order_quantity ? prevQuantity - 1 : prevQuantity
        );
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className='product-div'>
            <div className='product-detail-container'>
                <div className='product-detail-img-container'>
                    <img 
                        src={`http://sharmasteel.in:8080${product.product_image_main}`} 
                        alt="Main Product" 
                    />
                    {product.additional_images.map((img, index) => (
                        <img 
                            key={index} 
                            src={`http://sharmasteel.in:8080${img.image}`} 
                            alt={`Additional ${index + 1}`} 
                        />
                    ))}
                </div>
                
                <div className='product-details'>
                    <h1>{product.brand_name}</h1>
                    <p>{product.specification}</p>
                   
                    <p>In Stock: {product.in_stock ? 'Yes' : 'No'}</p>

                    {/* Pricing logic */}
                    <p className="product-price">
                        {product.discount ? (
                            <>
                                ₹{product.selling_price}{' '}
                                {product.mrp && (
                                    <span className="old-price" style={{ textDecoration: 'line-through', color: 'gray' }}>
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

                    {/* Quantity control */}
                    <div className="quantity-control">
                    Minimum Order Quantity: 
                    <button onClick={decreaseQuantity} className="quantity-button">-</button>
                        <span className="quantity-display">{quantity}/{product.unit_of_measurement}</span>
                      
                        <button onClick={increaseQuantity} className="quantity-button">+</button>
                    </div>

                    <div className='add-buy-container'>
                        <button className='add-button'>Add To Cart</button>
                        <button className='buy-now'>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
