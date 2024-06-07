import React, { useEffect, useState } from 'react'
import Search from './Search'
import Navbar from './Navbar'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const RawHeader = ({ className }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [categoryData, setCategoryData] = useState([])

  useEffect(() => {
    if (/^\/products\/list\/\d+$/.test(location.pathname)){
      getCategory(location.pathname.split('/')[3])
    }
  }, [location.pathname])

  const getCategory = async(id) =>{
    await axios.get(`/categories/${id}`)
    .then(response => {
      console.log(response.data)
      setCategoryData(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const getTitle = (pathname) => {
    if (/^\/products\/list\/\d+$/.test(pathname)) {
      return `Productos de ${categoryData.name}`;
    } else if (/^\/products\/\d+$/.test(pathname)) {
      return 'Detalles del Producto';
    } else {
      switch(pathname) {
        case '/':
          return 'El Chopo';
        case '/categories':
          return 'Categorias';
        case '/login':
          return 'Log In';
        case '/gestion':
          return 'Gestion Administrativa';
        case '/profile':
          return 'Perfil Usuario';
        case '/cart':
          return 'Carrito';
        default:
          return 'El Chopo';
      }
    }
  }

  return (
    <header className={className}>
      <div className='cabecera'>
        <img alt='logo' src='/logo192.png' onClick={()=>navigate('/')}/>
        <h1>{getTitle(location.pathname)}</h1>
        <Search/>
        <Navbar />
      </div>
    </header>
  )
}

const Header = styled(RawHeader)`
.cabecera {
    background-color: #F4EB9B;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
  
  img {
    height: 150px;
    cursor: pointer;
  }
  
  h1 {
    margin: 0;
    padding: 0; 
    font-size: 2rem;
  }

  nav {
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
    color: #000;
    text-decoration: none;
  }

  nav a:hover {
    color: #ccc;
  }
  .input_container{
    position: relative;
  }
  input{
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 95%;
  }
  .search_icon{
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }  
`

export default Header