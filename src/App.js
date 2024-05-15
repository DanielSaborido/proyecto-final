import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './pages/Category';
import Product from './pages/Product';
import Login from './pages/Login';
import User from './pages/User';
import Admin from './pages/Admin';
import ShoppingCart from './pages/ShoppingCart';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/products/:categoryId" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<User />} />
        <Route path="/profile" element={<Admin />} />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
    </Router>
  );
}

export default App;