import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderSummary.css";

const OrderSummary = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const location = useLocation();
  const { orderData, address } = location.state || {};
  const navigate = useNavigate();
  const [addressDetails, setAddressDetails] = useState(address || null);
  const [paymentMethod, setPaymentMethod] = useState("Online");

  useEffect(() => {
    if (orderData && orderData.address_id && !addressDetails) {
      fetchAddressById(orderData.address_id);
    }
  }, [orderData, addressDetails]);
  console.log("orderdata from cart page", orderData);
  const fetchAddressById = async (addressId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${apiUrl}/user-accounts/addresses/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allAddresses = response.data.user_Addresses || [];
      const matchingAddress = allAddresses.find(
        (addr) => addr.id === addressId
      );
      if (matchingAddress) {
        setAddressDetails(matchingAddress);
      } else {
        console.error("Matching address not found for address_id:", addressId);
      }
    } catch (error) {
      console.error("Error fetching address by ID:", error);
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'Online') {
      try {
        // 1) Create order on your backend
        const createRes = await axios.post(
          `${apiUrl}/order/create-order/`,
          {
            order_summary_id: orderData.id,
            payment_method: 'online',
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        const {
          razorpay_order_id,
          amount,
          currency,
          RAZORPAY_KEY_ID,
          order_id,
        } = createRes.data;

        // 2) Configure Razorpay checkout
        const options = {
          key: RAZORPAY_KEY_ID,
          amount,
          currency,
          name: 'Your Company Name',
          description: 'Order Payment',
          order_id: razorpay_order_id,
          handler: async (razorpayResponse) => {
            try {
              // 3) Verify payment on your backend
              const verifyRes = await axios.post(
                `${apiUrl}/payments/verify-payment/`,
                {
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_order_id: razorpayResponse.razorpay_order_id,
                  razorpay_signature: razorpayResponse.razorpay_signature,
                  order_id, // original order_id from create-order
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                  },
                }
              );

              if (verifyRes.data.success) {
                alert('Payment successful!');
                navigate('/order-success', { state: { orderId: order_id } });
              } else {
                console.error('Verification API error:', verifyRes.data);
                alert('Payment verification failed: ' + verifyRes.data.message);
              }
            } catch (err) {
              console.error('Payment verification failed:', err);
              alert('Payment verification failed. Please try again.');
            }
          },
          theme: { color: '#3399cc' },
          // ...any other Razorpay options...
        };

        // 4) Open Razorpay modal
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error('Error initiating payment:', err);
        alert('Failed to initiate payment. Please try again.');
      }
    } else if (paymentMethod === 'COD') {
      try {
        const codRes = await axios.post(
          `${apiUrl}/order/create-order/`,
          {
            order_summary_id: orderData.id,
            payment_method: 'cod',
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        alert('Order placed successfully with COD!');
        navigate('/order-success', { state: { orderId: codRes.data.order_id } });
      } catch (err) {
        console.error('Error placing COD order:', err);
        alert('Failed to place the order. Please try again.');
      }
    }
  };

  if (!orderData) {
    return <p>No order details found.</p>;
  }

  return (
    <>
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

      <div className="order-summary-page">
        <h1 className="order-summary-title">Order Summary</h1>
        <p className="order-total-price">
          Total Price: ₹{orderData.total_price}
        </p>

        {orderData.items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="product-image-container">
              <div className="image-badge-span">
                <img
                  src={`${apiUrl}${item.product_details.product_image_main}`}
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

        <div className="payment-method-section">
          <h3>Select Payment Method</h3>
          <div className="payment-method-section-div">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Online"
                checked={paymentMethod === "Online"}
                onChange={() => setPaymentMethod("Online")}
              />
              Online Payment
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery (COD)
            </label>
          </div>
        </div>

        <button
          className="place-order-button"
          onClick={handlePayment}
          disabled={!paymentMethod}
        >
          {paymentMethod === "Online" ? "Make Payment" : "Place Order"}
        </button>
        {/* <button className="add-address-button"  onClick={handlePayment}>Make Payment</button> */}
      </div>
    </>
  );
};

export default OrderSummary;
