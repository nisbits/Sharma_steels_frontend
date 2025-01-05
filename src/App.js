import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import ProductsList from './components/ProductsList/ProductsList'; // Import ProductsList component
import ProductCategory from './components/ProductCategory/ProductCategory'; // Import ProductCategory component
import ProductDetail from './components/ProductDetail/ProductDetail';
import Cart from './components/Cart/Cart';
import OrderSummary from './components/OrderSummary/OrderSummary';
import AddAddress from './components/AddAddress/AddAddress';
import MakePayment from './components/MakePayment/MakePayment';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/category/:id" element={<ProductCategory />} />
          <Route path="/product_detail/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart  />} />
          <Route path="/order-summary" element={<OrderSummary/>} />
          <Route path="/add-address" element={<AddAddress/>} />
          <Route path="/make-payment" element={<MakePayment/>} />
                  </Routes>
      </div>
    </Router>
  );
}

export default App;
