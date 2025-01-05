import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MakePayment.css";

const MakePayment = () => {
  const location = useLocation();
  const { orderData, address } = location.state || {}; 
  const [paymentMethod, setPaymentMethod] = useState("Online"); 
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (paymentMethod === "Online") {
      try {
        const response = await axios.post(
          "http://sharmasteel.in:8080/order/create-order/",
          { order_summary_id: orderData.id, payment_method: "online" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const { razorpay_order_id, amount, currency, RAZORPAY_KEY_ID } = response.data;

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          name: "Your Company Name",
          description: "Order Payment",
          order_id: razorpay_order_id,
          handler: async function (response) {
            try {
              await axios.post(
                "http://sharmasteel.in:8080/payments/verify-payment/",
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  },
                }
              );
              alert("Payment successful!");
              navigate("/payment-success");
            } catch (error) {
              console.error("Payment verification failed:", error);
              alert("Payment verification failed. Please try again.");
            }
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Error initiating payment:", error);
        alert("Failed to initiate payment. Please try again.");
      }
    } else if (paymentMethod === "COD") {
      try {
        await axios.post(
          "http://sharmasteel.in:8080/order/create-order/",
          { order_summary_id: orderData.id, payment_method: "cod" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        alert("Order placed successfully with COD!");
        navigate("/order-success");
      } catch (error) {
        console.error("Error placing COD order:", error);
        alert("Failed to place the order. Please try again.");
      }
    }
  };

  return (
    <div className="place-order-page">
      <h1>Place Order</h1>
      <div className="order-summary">
        <p>Total Price: ₹{orderData.total_price}</p>
        <div className="delivery-address">
          <h3>Delivery Address</h3>
          <p>{`${address.city}, ${address.state}, ${address.country} - ${address.zip_code}`}</p>
        </div>
      </div>

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
    </div>
  );
};

export default MakePayment;
