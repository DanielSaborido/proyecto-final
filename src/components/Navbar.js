import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import { ControlOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, ShoppingCartOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';

const RawNavbar = ({className}) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate()

  return (
    <nav className={className}>
      <ul>
        <li><Link to="/"><HomeOutlined/></Link></li>
        <li><Link to="/categories"><TagsOutlined /></Link></li>
        {token? (
          <>
            {token.charAt(0) !== 'C'? (
              <li><Link to="/gestion"><ControlOutlined /></Link></li>
            ) : (
              <>
                <li><Link to="/cart"><ShoppingCartOutlined /></Link></li>
                <li><Link to="/profile"><UserOutlined /></Link></li>
              </>
            )}
            <li onClick={()=>{localStorage.removeItem('token')}}><Link to="/"><LogoutOutlined /></Link></li>
          </>
        ) : (
          <li><Link to="/login"><LoginOutlined /></Link></li>
        )}
      </ul>
    </nav>
  )
}

const Navbar = styled(RawNavbar)`
`

export default Navbar