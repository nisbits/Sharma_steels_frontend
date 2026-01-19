import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import logoImage from "../../Assets/images/logo.jpeg";
import "./Navbar.css";
import profileImage from "../../Assets/images/profile.jpg";
import { IoCartOutline, IoMenu, IoClose, IoHome } from "react-icons/io5";
import { FaCaretDown, FaLocationDot } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { cartQuantity, setCartQuantity } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu and prevent body scroll
  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    // Prevent body scroll when menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('nav-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('nav-open');
    }
  };

  // Cleanup body styles on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('nav-open');
    };
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-wrapper')) {
        setIsDropdownOpen(false);
      }
    };

    // Handle window resize to reposition dropdown
    const handleResize = () => {
      if (isDropdownOpen) {
        const dropdownElement = document.querySelector('.dropdown-menu');
        const wrapperElement = document.querySelector('.dropdown-wrapper');
        
        if (dropdownElement && wrapperElement) {
          const rect = wrapperElement.getBoundingClientRect();
          const isMobile = window.innerWidth <= 768;
          
          if (isMobile) {
            // Align to right on mobile but with some padding
            dropdownElement.style.top = `${rect.bottom + 10}px`;
            dropdownElement.style.right = '10px';
            dropdownElement.style.left = 'auto';
            dropdownElement.style.transform = 'none';
          } else {
            // Position to the right on desktop
            dropdownElement.style.top = `${rect.bottom + 5}px`;
            dropdownElement.style.right = `${window.innerWidth - rect.right}px`;
            dropdownElement.style.left = 'auto';
            dropdownElement.style.transform = 'none';
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDropdownOpen]);
  let username = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
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
        setCartQuantity(total);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartQuantity();
  }, [token, setCartQuantity]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) {
        setAddresses([{ id: 0, full_address: "Test Address, Demo City" }]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/user-accounts/addresses/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
    handleMobileNavigation(() => navigate("/login"));
  };
  const handleProfileImageClick = () => {
    handleMobileNavigation(() => navigate("/feedback"));
  };
  const handleRegister = () => {
    handleMobileNavigation(() => navigate("/register"));
  };
  // Handle navigation clicks in mobile view
  const handleMobileNavigation = (callback) => {
    if (window.innerWidth <= 768) {
      // Close mobile menu after navigation
      setIsMobileMenuOpen(false);
      document.body.style.overflow = '';
      document.body.classList.remove('nav-open');
    }
    callback();
  };

  const handleHome = () => handleMobileNavigation(() => navigate("/"));
  const handleCart = () => handleMobileNavigation(() => navigate("/cart"));
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  // Dropdown handlers
  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);
    
    if (newState) {
      // Position the dropdown menu
      setTimeout(() => {
        const dropdownElement = document.querySelector('.dropdown-menu');
        const wrapperElement = document.querySelector('.dropdown-wrapper');
        
        if (dropdownElement && wrapperElement) {
          const rect = wrapperElement.getBoundingClientRect();
          const isMobile = window.innerWidth <= 768;
          
          if (isMobile) {
            // Align to right on mobile but with some padding
            dropdownElement.style.top = `${rect.bottom + 10}px`;
            dropdownElement.style.right = '10px';
            dropdownElement.style.left = 'auto';
            dropdownElement.style.transform = 'none';
          } else {
            // Position to the right on desktop
            dropdownElement.style.top = `${rect.bottom + 5}px`;
            dropdownElement.style.right = `${window.innerWidth - rect.right}px`;
            dropdownElement.style.left = 'auto';
            dropdownElement.style.transform = 'none';
          }
        }
      }, 0);
    }
  };
  const goToMyOrders = () => {
    handleMobileNavigation(() => {
      navigate("/my-orders");
      setIsDropdownOpen(false);
    });
  };
  
  const goToMyDetails = () => {
    handleMobileNavigation(() => {
      navigate("/my-details");
      setIsDropdownOpen(false);
    });
  };

  const handleLogo = () => {
    navigate("/");
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar-container">
        <div className="logo">
          <img src={logoImage} alt="Logo" onClick={handleLogo} />
        </div>
      
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
      </button>

      <div className={`nav-buttons ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {username ? (
          <>
            <div className="home-btn" onClick={handleHome}>
              <IoHome className="home-icon" />
              <span>Home</span>
            </div>
            <div className="address-section">
              <FaLocationDot style={{ marginTop: "7px" }} />
            </div>
            <div className="cart-container-icon">
              <IoCartOutline onClick={handleCart} className="cart-icon" />
              {cartQuantity > 0 && (
                <span className="custom-badge">{cartQuantity}</span>
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
              <div className="dropdown-wrapper">
                <FaCaretDown onClick={toggleDropdown} style={{ cursor: "pointer" }} />
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={goToMyOrders}>My Orders</button>
                    <button onClick={goToMyDetails}>My Details</button>
                  </div>
                )}
              </div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <div className="address-section">
              <FaLocationDot style={{ marginTop: "7px" }} />
              <p>Test Address, Demo City</p>
            </div>
            <div className="home-btn" onClick={handleHome}>
              <IoHome className="home-icon" />
              <span>Home</span>
            </div>
            <div className="login-register-btn">
              <button onClick={handleLogin}>Login</button>
              <button onClick={handleRegister}>Register</button>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default Navbar;
