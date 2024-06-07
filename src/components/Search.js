import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const RawSearch = ({className}) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [productsFilter, setProductsFilter] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = () => {
    axios.get('/products')
    .then(response => {
      setProducts(response.data)
      setProductsFilter(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    setSearchTerm(event.target.value);
    if (event.target.value!==''){
      setShowSearch(true);
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(event.target.value.toLowerCase())
      ).slice(0, 5);
      setProductsFilter(filteredProducts);
    } else {clear()}
  }

  const clear = () => {
    setProductsFilter(products)
    setShowSearch(false)
    setSearchTerm('')
  }

  return (
    <div className={className}>
      <section className='input_container'>
        <input
          type="text"
          placeholder='Busqueda de productos'
          value={searchTerm}
          onInput={handleSearch}
        />
        <SearchOutlined
          className='search_icon'
        />
      </section>
      {showSearch && (
        <section className='search'>
          <ul>
            {productsFilter?.map((product) => (
              <li key={product.id} onClick={() => {clear();navigate(`/products/${product.id}`)}}>{product.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

const Search = styled(RawSearch)`
`

export default Search;