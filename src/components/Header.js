import React from 'react'
import Search from './Search'
import Navbar from './Navbar'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const RawHeader = ({ className }) => {
  const navigate = useNavigate()
  return (
    <header className={className}>
      <img alt='logo' src='/logo192.png' onClick={()=>navigate('/')}/>
      <h1>El Chopo</h1>
      <Search/>
      <Navbar />
    </header>
  )
}

const Header = styled(RawHeader)`
header {
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