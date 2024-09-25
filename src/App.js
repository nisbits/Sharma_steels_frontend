import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Register from './components/Register/Register';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
