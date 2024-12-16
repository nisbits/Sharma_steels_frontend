import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderSummary.css";

const OrderSummary = () => {
  const location = useLocation();
  const { orderData } = location.state || {}; 
  const navigate = useNavigate();
  if (!orderData) {
    return <p>No order details found.</p>;
  }

  const handleAddAddress = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get("http://sharmasteel.in:8080/user-accounts/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Fetched Addresses:", response.data);

      // Navigate to AddAddress page with orderData and fetched addresses
      navigate("/add-address", { state: { orderData, addresses: response.data } });
    } catch (error) {
      console.error("Error fetching addresses:", error);
      alert("Failed to fetch addresses. Please try again.");
    }
  };



  return (
    <div className="order-summary-page">
      <h1 className="order-summary-title">Order Summary</h1>
      <p className="order-total-price">Total Price: ₹{orderData.total_price}</p>

      {orderData.items.map((item, index) => (
        <div key={index} className="order-item">
          {/* Product Image and Details */}
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
                    ₹{item.product_details.selling_price} /{" "}
                    {item.product_details.unit_of_measurement}
                    {item.product_details.mrp && (
                      <span
                        className="old-price"
                        style={{
                          textDecoration: "line-through",
                          color: "gray",
                        }}
                      >
                        ₹{item.product_details.mrp} /{" "}
                        {item.product_details.unit_of_measurement}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    ₹{item.product_details.mrp} /{" "}
                    {item.product_details.unit_of_measurement}
                  </>
                )}
              </h3>
            </div>
          </div>

          {/* Additional Details */}
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
              <p>₹{item.base_price}</p>
            </div>

            {item.extra_charges_breakdown &&
              item.extra_charges_breakdown.map((charge, idx) => (
                <div className="total-div" key={idx}>
                  <h6>
                    <strong>
                      {charge.name} ({charge.amount}/
                      {item.product_details.unit_of_measurement}):
                    </strong>
                  </h6>
                  <p>₹{charge.total_amount_for_quantity}</p>
                </div>
              ))}
          </div>
          <hr className="horizontal-line" />
          <div className="total-div">
            <h3>Total</h3>
            <p>₹{item.total_price}</p>
          </div>
        </div>
      ))}

      <button className="add-address-button"  onClick={handleAddAddress}>Add Address</button>
    </div>
  );
};

export default OrderSummary;
