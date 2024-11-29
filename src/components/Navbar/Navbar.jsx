import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logoImage from '../../Assets/images/logo.jpeg';
import './Navbar.css';
import profileImage from '../../Assets/images/profile.jpg';
import { IoCartOutline } from "react-icons/io5";
import { Badge } from 'rsuite';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  let username = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decodedToken.exp && decodedToken.exp > currentTime) {
        username = decodedToken.user_id || decodedToken.sub; // Decodes and sets the username
      } else {
        console.warn('Token has expired');
        localStorage.removeItem('accessToken'); // Clear expired token
        navigate('/login');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('accessToken'); // Clear invalid token
    }
  }

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
            <IoCartOutline onClick={handleCart} className='cart-icon' /> <Badge color="blue" content="99+" ></Badge>
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
