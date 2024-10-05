import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import ProductsList from './components/ProductsList/ProductsList'; // Import ProductsList component
import ProductCategory from './components/ProductCategory/ProductCategory'; // Import ProductCategory component

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductsList />} /> {/* Route for ProductsList */}
          <Route path="/category/:categoryName" element={<ProductCategory />} /> {/* Dynamic route for ProductCategory */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
