import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logoImage from '../../Assets/images/logo.jpeg';
import './Navbar.css';
import profileImage from '../../Assets/images/profile.jpg'

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken'); 

  let username = null;
console.log("token", token)
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      username = decodedToken.user_id || decodedToken.sub;
      console("username", username)
    } catch (error) {
      console.error('Invalid token');
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
    localStorage.removeItem('accessToken'); 
    navigate('/'); 
  };

  return (
    <div className='navbar-container'>
      <div className='logo'>
        <img src={logoImage} alt='Logo' onClick={handleLogo} />
      </div>
      <div className='nav-buttons'>
        {username ? (
          <>
          <span className='username-display'><img src={profileImage}/>{username}</span>
          <button onClick={handleLogout}>Logout</button>
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
