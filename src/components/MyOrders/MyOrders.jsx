import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

const MyOrders = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("accessToken");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("You must be logged in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/order/my-orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiUrl, token]);

  if (loading) {
    return <div className="orders-container">Loading orders...</div>;
  }

  if (error) {
    return <div className="orders-container error">{error}</div>;
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order {order.id}</span>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-info">
                <p><strong>Total:</strong> ₹{order.total_price}</p>
                <p><strong>Payment:</strong> {order.payment_status ? "Paid" : "Unpaid"}</p>
                <p><strong>Razorpay ID:</strong> {order.razorpay_tracking_id || "N/A"}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
