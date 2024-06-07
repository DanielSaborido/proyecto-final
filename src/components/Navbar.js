import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';

const RawNavbar = ({className}) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate()

  return (
    <nav className={className}>
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
            <li onClick={()=>{localStorage.removeItem('token')}}><Link to="/">Cerrar sesión</Link></li>
          </>
        ) : (
          <li><Link to="/login">Iniciar sesión</Link></li>
        )}
      </ul>
    </nav>
  )
}

const Navbar = styled(RawNavbar)`
`

export default Navbar