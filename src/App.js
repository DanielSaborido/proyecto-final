import React from 'react'
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes,  Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Category from './pages/Category'
import ProductList from './pages/ProductList'
import Product from './pages/ProductData'
import Login from './pages/Login'
import User from './pages/User'
import Admin from './pages/Admin'
import ShoppingCart from './pages/ShoppingCart'
import styled from 'styled-components';
import ProtectedRoute from './components/ProtectedRoute';

function RawApp({className}) {
  axios.defaults.baseURL = 'https://api-proyecto-final-production.up.railway.app/api';

  return (
    <div className={className}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/products/list/:id" element={<ProductList />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute element={<User />} allowedRoles={['customer']} />} />
          <Route path="/gestion" element={<ProtectedRoute element={<Admin />} allowedRoles={['user']} />} />
          <Route path="/cart" element={<ProtectedRoute element={<ShoppingCart />} allowedRoles={['customer']} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  )
}

const App = styled(RawApp)`
* {
  padding: 1%;
}

.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`

export default App