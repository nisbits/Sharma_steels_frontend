import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderSummary.css";

const OrderSummary = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderSummary = async () => {
      const userToken = localStorage.getItem("accessToken");

      if (!userToken) {
        alert("Please log in to view your order summary.");
        return;
      }

      try {
        const response = await axios.post(
          "http://sharmasteel.in:8080/cart/create-order-summary/",
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setOrderData(response.data);
        console.log(response);
      } catch (err) {
        console.error("Error fetching order summary:", err);
        setError("Failed to load order summary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSummary();
  }, []);

  if (loading) {
    return <p className="loading-message">Loading order summary...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!orderData || !orderData.items) {
    return <p>No order details found.</p>;
  }

  return (
    <div className="order-summary-page">
      <h1 className="order-summary-title">Order Summary</h1>
      <p className="order-total-price">Total Price: ₹{orderData.total_price}</p>

      {orderData.items.map((item, index) => (
        <div key={index} className="order-item">
          {/* Product Image and Brief Info */}
          <div className="product-image-container">
            <div className="image-badge-span">
              <img
                src={`http://sharmasteel.in:8080${item.product_details.product_image_main}`}
                alt={item.product_details.brand_name}
                className="product-image12"
              />
              {item.product_details.discount > 0 && (
    <span className="discount-badge">
      -{item.product_details.discount}%
    </span>
  )}
            </div>

            <div className="product-basic-details">
              <p>
                <strong>{item.product_details.brand_name}</strong>
              </p>
              <p>{item.product_details.specification}</p>
              <h3 className="product-price">
                {item.product_details.discount ? (
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
              </h3>
            </div>
          </div>

          {/* Product Price with Discount Logic */}
          <div className="product-details21">
            <div className="total-div">
              <h6>
                <strong>Quantity:</strong>
              </h6>
              <p>{item.quantity}</p>
            </div>
            <div className="total-div">
              <h6>
                <strong>Product Price:</strong>
              </h6>
              <p>{item.base_price}</p>
            </div>

            {/* Extra Charges */}
            {item.extra_charges_breakdown &&
              item.extra_charges_breakdown.map((charge, idx) => (
                <div className="total-div">
                  <h6>
                    {" "}
                    <strong>
                      {charge.name}({charge.amount}/{" "}
                      {item.product_details.unit_of_measurement}):
                    </strong>{" "}
                  </h6>
                  <p key={idx}>₹{charge.total_amount_for_quantity}</p>
                </div>
              ))}
          </div>
          <hr className="horizontal-line"/>
          <div className="total-div">
            <h3>Total</h3>
            <p>{item.total_price}</p>
          </div>
        </div>
      ))}

      <button className="add-address-button">Add Address</button>
    </div>
  );
};

export default OrderSummary;
