import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const RawSearch = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [showClear, setShowClear] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault()
    setSearchTerm(event.target.value);
    setShowClear(true);
    await axios.get(`http://api-proyecto-final.test/api/products/search`, {params: { search: event.target.value }})
   .then(response => {
    console.log(response.data)
      setProducts(response.data);
    })
   .catch(error => {
      console.error('There was an error!', error);
    });
  }

  const handleClear = () => {
    setSearchTerm('');
    setShowClear(false);
  }

  return (
    <>
      <div className='input_container'>
        <input
          type="text"
          placeholder='Busqueda de productos'
          value={searchTerm}
          onChange={handleSearch}
        />
        {showClear && (
          <SearchOutlined
            className='search_icon'
            onClick={handleClear}
          />
        )}
      </div>
      {products.length > 0 && (
        <div>
          <ul>
            {products?.map((product) => (
              <li key={product.id} onClick={() => navigate(`/products/${product.id}`)}>{product.name}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

const Search = styled(RawSearch)`
  .input_container{
    position: relative;
  }
  input{
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
  .search_icon{
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }
`

export default Search;