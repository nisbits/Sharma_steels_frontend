import React from 'react'
import ProductCards from '../ProductCards/ProductCards'
import Header from '../Header/Header'
import ProductsList from '../ProductsList/ProductsList'

const Home = () => {
  return (
    <div>
      <ProductsList/>
        <Header/>
      <ProductCards/>
    </div>
  )
}

export default Home
