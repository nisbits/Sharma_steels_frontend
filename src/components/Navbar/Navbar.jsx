import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import logoImage from '../../Assets/images/logo.jpeg';
import './Navbar.css';
import profileImage from '../../Assets/images/profile.jpg';
import { IoCartOutline } from "react-icons/io5";
import { Badge } from 'rsuite';

const Navbar = () => {
  const navigate = useNavigate();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const token = localStorage.getItem('accessToken');

  let username = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decodedToken.exp && decodedToken.exp > currentTime) {
        username = decodedToken.user_id || decodedToken.sub; 
      } else {
        console.warn('Token has expired');
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('accessToken'); 
    }
  }
  
  useEffect(() => {
    const fetchCartQuantity = async () => {
      if (!token) return;
  
      try {
        const response = await axios.get(`http://sharmasteel.in:8080/cart/items/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const items = response.data.cart_items || [];
        const total = items.reduce((acc, item) => acc + item.quantity, 0);
        setTotalQuantity(total); // State update
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
  
    fetchCartQuantity();
  }, [token]);
  
  useEffect(() => {
    console.log("Updated Total Quantity in state:", totalQuantity);
  }, [totalQuantity]);
  

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogo = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear the token from localStorage
    navigate('/'); // Redirect to home after logout
  };

  const handleCart = () => {
    navigate('/cart');
  };

  return (
    <div className='navbar-container'>
      <div className='logo'>
        <img src={logoImage} alt='Logo' onClick={handleLogo} />
      </div>
      <div className='nav-buttons'>
        {username ? (
          <>
            <span className='username-display'>
              <img src={profileImage} alt='Profile' />
              {username}
            </span>
            <button onClick={handleLogout}>Logout</button>
            <div className="cart-container-icon">
              <IoCartOutline onClick={handleCart} className='cart-icon' />
              {/* {totalQuantity > 0 && (
                <Badge color="blue" content={totalQuantity} className='custom-badge' />
              )} */}
               {totalQuantity > 0 && (
                <span className="custom-badge">{totalQuantity}</span>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;








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
