import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './pages/Category';
import Product from './pages/Product';
import Login from './pages/Login';
import User from './pages/User';
import ShoppingCart from './pages/ShoppingCart';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/categories" component={Category} />
        <Route path="/products/:categoryId" component={Product} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={User} />
        <Route path="/cart" component={ShoppingCart} />
        <Route path="/manage" component={UserManagement} />
      </Switch>
    </Router>
  );
}

export default App;