import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/categories">Categorías</Link></li>
        <li><Link to="/login">Iniciar sesión</Link></li>
        <li><Link to="/profile">Perfil</Link></li>
        <li><Link to="/cart">Carrito</Link></li>
        <li><Link to="/manage">Gestión</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;