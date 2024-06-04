import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Category from './pages/Category'
import ProductList from './pages/ProductList'
import Product from './pages/ProductData'
import Login from './pages/Login'
import User from './pages/User'
import Admin from './pages/Admin'
import ShoppingCart from './pages/ShoppingCart'

function App() {
  const [userType, setUserType] = useState(null)
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userType = token.charAt(0) === 'C'? 'user' : 'admin'
      setUserType(userType)
    }
  }, [])

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/products/list/:id" element={<ProductList />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<User />} />
        <Route path="/gestion" element={<Admin />} />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
    </Router>
  )
}

export default App