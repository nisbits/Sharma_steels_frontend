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
import OrderSuccess from './components/OrderSuccess/OrderSuccess';
import Feedback from './components/Feedback/Feedback';
import Legal from './components/Legal/Legal';
import Contact from './components/Contact/Contact';
import LegalDetail from './components/LegalDetail/LegalDetail';
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
          <Route path="/order-success" element={<OrderSuccess/>} />
          <Route path="/feedback" element={<Feedback/>} />
          <Route path="/legal" element={<Legal/>} />
        <Route path="/contact"  element={<Contact/>}/>
        <Route path="/legal/:id" element={<LegalDetail/>} />
                  </Routes>
      </div>
    </Router>
  );
}

export default App;
