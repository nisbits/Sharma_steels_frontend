import React from 'react'
import hedaerImage from '../../Assets/images/headerImage.jpg'
import './Header.css'
const Header = () => {
  return (
    <div className='header-container'>
      <img src={hedaerImage}/>
    </div>
  )
}

export default Header
