import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("User is not authenticated");
      navigate("/login");
      setLoading(false);
      return;
    }

    axios
      .get(`http://sharmasteel.in:8080/cart/items/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const items = response.data.cart_items || [];
        console.log("Fetched cart items:", items);
        setCartItems(items);
        calculateTotalItems(items);
        fetchSubtotal();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setLoading(false);
      });
  }, [userId, navigate]);

  const calculateTotalItems = (items) => {
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    setTotalItems(totalQuantity);
  };

  const fetchSubtotal = () => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(`http://sharmasteel.in:8080/cart/get-subtotal/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSubtotal(response.data.subtotal.toFixed(2));
      })
      .catch((error) => {
        console.error("Error fetching subtotal:", error);
      });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    const token = localStorage.getItem("accessToken");

    axios
      .post(
        `http://sharmasteel.in:8080/cart/update-quantity/`,
        {
          cart_item_id: cartItemId,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const updatedItem = response.data;
        setCartItems((prevItems) => {
          const newItems = prevItems.map((item) =>
            item.id === cartItemId
              ? {
                  ...item,
                  quantity: updatedItem.quantity,
                  total_price: updatedItem.total_price,
                }
              : item
          );
          calculateTotalItems(newItems);
          fetchSubtotal();
          return newItems;
        });
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
  };

  const increaseQuantity = (item) => {
    const newQuantity = item.quantity + 1;
    updateQuantity(item.id, newQuantity);
  };

  const decreaseQuantity = (item) => {
    const newQuantity = item.quantity > 1 ? item.quantity - 1 : 1;
    updateQuantity(item.id, newQuantity);
  };

  const handleRemoveItem = (cartItemId) => {
    deleteCartItem(cartItemId);
  };

  const deleteCartItem = (cartItemId) => {
    const token = localStorage.getItem("accessToken");

    axios
      .delete(`http://sharmasteel.in:8080/cart/delete-item/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { cart_item_id: cartItemId },
      })
      .then(() => {
        setCartItems((prevItems) => {
          const newItems = prevItems.filter(
            (item) => item.id !== cartItemId && item.product_id !== cartItemId
          );
          calculateTotalItems(newItems);
          fetchSubtotal();
          return newItems;
        });
      })
      .catch((error) => {
        console.error("Error deleting item from cart:", error);
      });
  };

  if (loading) return <p>Loading...</p>;
  const baseUrl = "http://sharmasteel.in:8080";
  return (
    <div className="cart-main-container">
      <h2>Your Cart</h2>
      <div className="cart-container">
        <h2>Total Items: {totalItems}</h2>
        <h4>Subtotal: ₹{subtotal}</h4>
        <button className="checkout-button">Proceed to Checkout</button>

        {cartItems.length > 0 ? (
          <div className="cart-items">
            {cartItems.map((item) => (
                <div className="cart-main-cont">
              <div key={item.id || item.product_id} className="cart-item">
                <div className="product-details1">
                  <img
                    src={`${baseUrl}${item.product_details.product_image_main}`}
                    className="product-image1"
                  />
                   {item.product_details.discount > 0 && (
    <span className="discount-badge">
      -{item.product_details.discount}%
    </span>
  )}
                 
                </div>
                <div>
                  <h3>{item.product_details.brand_name}</h3>
                  <p>{item.product_details.specification}</p>
                  <p className="product-price">
                    {item.product_details.discount > 0 ? (
                      <>
                        ₹{item.product_details.selling_price} /
                        {item.product_details.unit_of_measurement}
                        {item.product_details.mrp && (
                          <span
                            className="old-price"
                            style={{
                              textDecoration: "line-through",
                              color: "gray",
                          
                            }}
                          >
                            ₹{item.product_details.mrp} /
                            {item.product_details.unit_of_measurement}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        ₹{item.product_details.mrp} /
                        {item.product_details.unit_of_measurement}
                      </>
                    )}
                  </p>

                  {/* Total Price */}
                  <p className="product-total-price">
                    Total Price:{" "}
                    {item.product_details.discount > 0 ? (
                      <>
                        ₹
                        {(
                          item.product_details.selling_price * item.quantity
                        ).toFixed(2)}
                      </>
                    ) : (
                      <>
                        ₹{(item.product_details.mrp * item.quantity).toFixed(2)}
                      </>
                    )}
                  </p>

                  <div className="remove-item">
                    <FaTrash
                      onClick={() =>
                        handleRemoveItem(item.id || item.product_id)
                      }
                    />
                  </div>
                </div>
               
              </div>
               <div className="quantity-control">
               <button onClick={() => decreaseQuantity(item)}>-</button>
               <span>{item.quantity}</span>
               <button onClick={() => increaseQuantity(item)}>+</button>
             </div>
             </div>
            ))}
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
