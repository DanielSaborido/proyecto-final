import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Search from './Search'
import { useNavigate } from 'react-router-dom';

const RawNavbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate()

  return (
    <nav>
      <Search/>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/categories">Categorías</Link></li>
        {token? (
          <>
            <li><Link to="/cart">Carrito</Link></li>
            {token.charAt(0) !== 'C'? (
              <li><Link to="/gestion">Gestión</Link></li>
            ) : (
              <li><Link to="/profile">Perfil</Link></li>
            )}
            <li onClick={()=>{localStorage.removeItem('token');navigate('/')}}>Cerrar Sesión</li>
          </>
        ) : (
          <li><Link to="/login">Iniciar sesión</Link></li>
        )}
      </ul>
    </nav>
  )
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

export default Navbar