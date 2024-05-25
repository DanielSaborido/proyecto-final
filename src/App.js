import React, { useEffect, useState } from 'react'
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
import { getLocalStorage } from './utils/localStorage'

function App() {
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    const token = getLocalStorage('token')
    if (token) {
      const userType = token.charAt(0) === 'C'? 'admin' : 'user'
      setUserType(userType)
    }
  }, [])

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/products/list/:categoryId" element={<ProductList />} />
        <Route path="/products/:productId" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={userType === 'admin'? <Admin /> : <User />}
        />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
    </Router>
  )
}

export default App