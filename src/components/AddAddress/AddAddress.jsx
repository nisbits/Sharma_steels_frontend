import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddAddress.css";
import { useNavigate } from "react-router-dom";

const AddAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    receiver_name: "",
    receiver_phone_number: "",
    address_line_1: "",
    city: "",
    state: "",
    zip_code: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          "http://sharmasteel.in:8080/user-accounts/addresses/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.user_Addresses) {
          setAddresses(response.data.user_Addresses);
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Failed to load addresses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(
        "http://sharmasteel.in:8080/user-accounts/addresses/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await axios.get(
        "http://sharmasteel.in:8080/user-accounts/addresses/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses(response.data.user_Addresses || []);
      setShowAddModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Failed to add address. Please try again.");
    }
  };

  const handleProceed = () => {
    if (!selectedAddress) {
      alert("Please select an address to proceed.");
      return;
    }
    console.log("Selected Address:", selectedAddress);
    navigate("/order-summary", { state: { selectedAddress } });
  };

  if (loading) return <p>Loading addresses...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="add-address-page">
      <h2>Manage Addresses</h2>

      {addresses.length > 0 ? (
        <ul className="address-list">
          {addresses.map((address) => (
            <li key={address.id} className="address-item">
              <label className="address-label">
                <input
                  type="checkbox"
                  checked={selectedAddress?.id === address.id}
                  onChange={() => setSelectedAddress(address)}
                />
                <div className="address-details">
                  <h3>{address.receiver_name}</h3>
                  <p>Phone: {address.receiver_phone_number}</p>
                  <p>{address.address_line_1}</p>
                  <p>
                    {address.city}, {address.state} - {address.zip_code}
                  </p>
                  {address.is_default && (
                    <span className="default-badge">Default</span>
                  )}
                </div>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p>No addresses found. Please add one.</p>
      )}
      <div className="proceed-button-add">
        <button
          className="proceed-button"
          onClick={handleProceed}
          disabled={!selectedAddress}
        >
          Proceed with Selected Address
        </button>

        <button
          className="add-address-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add Address
        </button>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Address</h2>
            <form onSubmit={handleAddAddress}>
              <input
                type="text"
                name="receiver_name"
                placeholder="Receiver Name"
                value={formData.receiver_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="receiver_phone_number"
                placeholder="Phone Number"
                value={formData.receiver_phone_number}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address_line_1"
                placeholder="Address"
                value={formData.address_line_1}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="zip_code"
                placeholder="Zip Code"
                value={formData.zip_code}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Address Added Successfully!</h3>
            <button onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAddress;
