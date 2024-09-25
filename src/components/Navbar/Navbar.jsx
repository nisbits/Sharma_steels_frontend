import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../Assets/images/logo.jpeg';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };
  const handleLogo = ()=>{
    navigate('/');
  }

  return (
    <div className='navbar-container'>
      <div className='logo'>
        <img src={logoImage} alt='Logo' onClick={handleLogo} />
      </div>
      <div className='nav-buttons'>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Navbar;
