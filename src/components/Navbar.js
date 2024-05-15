import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const RawNavbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/categories">Categorías</Link></li>
        <li><Link to="/login">Iniciar sesión</Link></li>
        <li><Link to="/profile">Perfil</Link></li>
        <li><Link to="/cart">Carrito</Link></li>
        {/* <li><Link to="/manage">Gestión</Link></li> */}
      </ul>
    </nav>
  );
}

const Navbar = styled(RawNavbar)`
  nav {
    background-color: #333;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  nav li {
    margin-right: 20px;
  }

  nav a {
    color: #fff;
    text-decoration: none;
  }

  nav a:hover {
    color: #ccc;
  }
`

export default Navbar;