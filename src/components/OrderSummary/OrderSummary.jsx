import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderSummary.css";

const OrderSummary = () => {
  const location = useLocation();
  const { orderData, address } = location.state || {}; // address may include only address_id
  const navigate = useNavigate();
  const [addressDetails, setAddressDetails] = useState(address || null); // Initialize with passed address or null

  useEffect(() => {
    if (orderData && orderData.address_id && !addressDetails) {
      fetchAddressById(orderData.address_id); // Fetch address details using address_id
    }
  }, [orderData, addressDetails]);
  
  const fetchAddressById = async (addressId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://sharmasteel.in:8080/user-accounts/addresses/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const allAddresses = response.data.user_Addresses || [];
      const matchingAddress = allAddresses.find((addr) => addr.id === addressId);
      if (matchingAddress) {
        setAddressDetails(matchingAddress);
      } else {
        console.error("Matching address not found for address_id:", addressId);
      }
    } catch (error) {
      console.error("Error fetching address by ID:", error);
    }
  };
  

  if (!orderData) {
    return <p>No order details found.</p>;
  }

  return (
    <div className="order-summary-page">
      <h1 className="order-summary-title">Order Summary</h1>
      <p className="order-total-price">Total Price: ₹{orderData.total_price}</p>

      {orderData.items.map((item, index) => (
        <div key={index} className="order-item">
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

{addressDetails ? (
  <div className="delivery-address">
    <h3>Delivery Address</h3>
    <p>
      {addressDetails.city}, {addressDetails.state},{" "}
      {addressDetails.country} - {addressDetails.zip_code}
    </p>
  </div>
) : (
  <p>Loading delivery address...</p>
)}


      <button className="add-address-button">Make Payment</button>
    </div>
  );
};

export default OrderSummary;
