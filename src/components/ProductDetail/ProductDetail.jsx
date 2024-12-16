import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductDetail.css';
import { useNavigate, useParams  } from 'react-router-dom';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate()
    const [orderDetails, setOrderDetails] = useState(null);
    const { productId } = useParams();
    useEffect(() => {
        axios.get(`http://sharmasteel.in:8080/products/product-details/${productId}`)
            .then(response => {
                const productData = response.data.product;
                setProduct(productData);
                setQuantity(productData.minimum_order_quantity || 1); 
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }, [productId]);

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prevQuantity => 
            prevQuantity > product.minimum_order_quantity ? prevQuantity - 1 : prevQuantity
        );
    };

    if (!product) return <p>Loading...</p>;



    const handleAddToCart = () => {
        const userToken = localStorage.getItem('accessToken'); 
        if (!userToken) {
            alert("Please log in to add items to your cart.");
            navigate('/login');
            return;
        }
    
        const cartData = {
            product_id: productId,
            quantity: quantity,
            minimum_order_quantity: product.minimum_order_quantity,
        };
    
        axios
            .post('http://sharmasteel.in:8080/cart/add-to-cart/', cartData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                console.log('Item added to cart successfully:', response.data);
                alert('Item added to cart successfully!');
            })
            .catch(error => {
                console.error('Error adding item to cart:', error);
                alert('Failed to add item to cart. Please try again.');
            });
    };
    
    
    const handleBuyNow = () => {
        const userToken = localStorage.getItem("accessToken");
      
        if (!userToken) {
          alert("Please log in to proceed with your purchase.");
          navigate("/login");
          return;
        }
      
        const requestData = {
          product_id: productId,
          quantity: quantity,
        };
      
        axios
          .post("http://sharmasteel.in:8080/cart/buy-now/", requestData, {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log("Buy Now successful:", response.data);
      
            const apiItem = response.data.items[0];
            const singleOrderData = {
              total_price: response.data.total_price,
              items: [
                {
                  quantity: apiItem.quantity,
                  base_price: apiItem.base_price,
                  product_details: {
                    brand_name: apiItem.product_details.brand_name,
                    specification: apiItem.product_details.specification,
                    selling_price: apiItem.product_details.selling_price,
                    mrp: apiItem.product_details.mrp,
                    unit_of_measurement: apiItem.product_details.unit_of_measurement,
                    product_image_main: apiItem.product_details.product_image_main,
                    discount: apiItem.product_details.discount,
                  },
                  extra_charges_breakdown: apiItem.extra_charges_breakdown || [],
                  total_price: apiItem.total_price,
                },
              ],
            };
      
            navigate("/order-summary", { state: { orderData: singleOrderData } });
          })
          .catch((error) => {
            console.error("Error during Buy Now:", error);
            alert("Failed to process your purchase. Please try again.");
          });
      };
      
      
      
    
    
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

                    <p className="product-price">
                        {product.discount ? (
                            <>
                                ₹{product.selling_price}/{product.unit_of_measurement}{' '}
                                {product.mrp && (
                                    <span className="old-price" style={{ textDecoration: 'line-through', color: 'gray' }}>
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

                    <div className="quantity-control">
                    Minimum Order Quantity: 
                    <button onClick={decreaseQuantity} className="quantity-button">-</button>
                        <span className="quantity-display">{quantity}</span>
                      
                        <button onClick={increaseQuantity} className="quantity-button">+</button>
                    </div>

                    <div className='add-buy-container'>
                        <button className='add-button' onClick={handleAddToCart}>Add To Cart</button>
                        <button className='buy-now' onClick={handleBuyNow}>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
