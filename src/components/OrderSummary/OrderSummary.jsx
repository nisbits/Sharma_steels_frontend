import React from "react";
import { useLocation } from "react-router-dom";
import "./OrderSummary.css";

const OrderSummary = () => {
  const location = useLocation();
  const { orderData } = location.state || {}; // Retrieve order data passed during navigation

  if (!orderData) {
    return <p>No order details found.</p>;
  }

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

      <button className="add-address-button">Add Address</button>
    </div>
  );
};

export default OrderSummary;
