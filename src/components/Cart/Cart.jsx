import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';

const Cart = ({ userId }) => { // Pass userId as prop
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user-specific cart
        axios.get(`/api/cart/${userId}`)
            .then(response => {
                setCartItems(response.data.cart || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching cart:', error);
                setLoading(false);
            });
    }, [userId]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {cartItems.length > 0 ? (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.productId}>
                            <h3>{item.brand_name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ₹{item.selling_price || item.mrp}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
