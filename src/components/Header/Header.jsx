import React from 'react'
import hedaerImage from '../../Assets/images/headerImage.jpg'
import './Header.css'
const Header = () => {
  return (
    <div className='header-container'>
      <h1>Sharma Steel</h1>
      <img src={hedaerImage}/>
    </div>
  )
}

export default Header
