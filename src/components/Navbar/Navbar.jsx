import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import logoImage from "../../Assets/images/logo.jpeg";
import "./Navbar.css";
import profileImage from "../../Assets/images/profile.jpg";
import { IoCartOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { cartQuantity, setCartQuantity } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]); // To store addresses
  const [loading, setLoading] = useState(true); // To track loading state
  const token = localStorage.getItem("accessToken");
  const [modalContent, setModalContent] = useState(null); // To store modal content
  const [isModalOpen, setIsModalOpen] = useState(false);
  let username = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Use jwtDecode here
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp > currentTime) {
        username = decodedToken.first_name || decodedToken.sub;
      } else {
        console.warn("Token has expired");
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("accessToken");
    }
  }

  useEffect(() => {
    const fetchCartQuantity = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${apiUrl}/cart/items/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = response.data.cart_items || [];
        const total = items.reduce((acc, item) => acc + item.quantity, 0);
        setCartQuantity(total); // use context
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartQuantity();
  }, [token, setCartQuantity]);
console.log("Navbar rendered, cartQuantity:", cartQuantity);


  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) {
        setAddresses([{ id: 0, full_address: "Test Address, Demo City" }]);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching addresses with token:", token); // Log token
        const response = await axios.get(`${apiUrl}/user-accounts/addresses/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data); // Log API response

        if (response.data.user_Addresses) {
          setAddresses(response.data.user_Addresses);
        } else {
          setAddresses([{ id: 0, full_address: "No address found" }]);
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setAddresses([{ id: 0, full_address: "Failed to load addresses" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  const handleLogin = () => {
    navigate("/login");
  };
  const handleProfileImageClick = async () => {
    navigate("/feedback");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogo = () => {
    navigate("/");
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  return (
    <div className="navbar-container">
      <div className="logo">
        <img src={logoImage} alt="Logo" onClick={handleLogo} />
      </div>
      <div className="nav-buttons">
        {username ? (
          <>
            <div className="address-section">
              <FaLocationDot style={{ marginTop: "7px" }} />
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  {addresses.length > 0 && (
                    <>
                      <span key={addresses[0].id}>
                        {addresses[0].city}, {addresses[0].state}{" "}
                        {addresses[0].country}-{addresses[0].zip_code}
                      </span>
                      {/* <p>Update Address</p> */}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="all-details">
              <span className="username-display">
                <img
                  src={profileImage}
                  alt="Profile"
                  onClick={handleProfileImageClick}
                />
                {username}
              </span>
              <button onClick={handleLogout}>Logout</button>
              <div className="cart-container-icon">
                <IoCartOutline onClick={handleCart} className="cart-icon" />
                {cartQuantity > 0 && (
                  <span className="custom-badge">{cartQuantity}</span>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="address-section">
              <FaLocationDot style={{ marginTop: "7px" }} />
              <p>Test Address, Demo City</p>
            </div>
            <div className="login-register-btn">
              <button onClick={handleLogin}>Login</button>
              <button onClick={handleRegister}>Register</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
{
  /* <p style={{ whiteSpace: "pre-wrap" }}>{item.content}</p>{" "} */
}
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import logoImage from '../../Assets/images/logo.jpeg';
// import './Navbar.css';
// import profileImage from '../../Assets/images/profile.jpg';
// import { IoCartOutline } from "react-icons/io5";
// import { Badge } from 'rsuite';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const token = localStorage.getItem('accessToken');

//   let username = null;

//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       const currentTime = Math.floor(Date.now() / 1000);

//       if (decodedToken.exp && decodedToken.exp > currentTime) {
//         username = decodedToken.user_id || decodedToken.sub;
//       } else {
//         console.warn('Token has expired');
//         localStorage.removeItem('accessToken');
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error('Invalid token:', error);
//       localStorage.removeItem('accessToken');
//     }
//   }

//   useEffect(() => {
//     const fetchCartQuantity = async () => {
//       if (!token) return;

//       try {
//         const response = await axios.get(`http://sharmasteel.in:8080/cart/items/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const items = response.data.cart_items || [];
//         const total = items.reduce((acc, item) => acc + item.quantity, 0);
//         setTotalQuantity(total);
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//       }
//     };

//     fetchCartQuantity();
//   }, [token]);

//   useEffect(() => {
//     console.log("Updated Total Quantity in state:", totalQuantity);
//   }, [totalQuantity]);

//   const handleLogin = () => {
//     navigate('/login');
//   };

//   const handleRegister = () => {
//     navigate('/register');
//   };

//   const handleLogo = () => {
//     navigate('/');
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     navigate('/');
//   };

//   const handleCart = () => {
//     navigate('/cart');
//   };

//   return (
//     <div className='navbar-container'>
//       <div className='logo'>
//         <img src={logoImage} alt='Logo' onClick={handleLogo} />
//       </div>
//       <div className='nav-buttons'>
//         {username ? (
//           <>
//             <span className='username-display'>
//               <img src={profileImage} alt='Profile' />
//               {username}
//             </span>
//             <button onClick={handleLogout}>Logout</button>
//             <div className="cart-container-icon">
//               <IoCartOutline onClick={handleCart} className='cart-icon' />
//               {/* {totalQuantity > 0 && (
//                 <Badge color="blue" content={totalQuantity} className='custom-badge' />
//               )} */}
//                {totalQuantity > 0 && (
//                 <span className="custom-badge">{totalQuantity}</span>
//               )}
//             </div>
//           </>
//         ) : (
//           <>
//           <div>
//             <p>Address</p>
//             <button>Update Address</button>
//           </div>
//             <button onClick={handleLogin}>Login</button>
//             <button onClick={handleRegister}>Register</button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import logoImage from '../../Assets/images/logo.jpeg';
// import './Navbar.css';

// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     navigate('/login');
//   };

//   const handleRegister = () => {
//     navigate('/register');
//   };
//   const handleLogo = ()=>{
//     navigate('/');
//   }

//   return (
//     <div className='navbar-container'>
//       <div className='logo'>
//         <img src={logoImage} alt='Logo' onClick={handleLogo} />
//       </div>
//       <div className='nav-buttons'>
//         <button onClick={handleLogin}>Login</button>
//         <button onClick={handleRegister}>Register</button>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
