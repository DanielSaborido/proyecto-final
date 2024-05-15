import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/products/0')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <>
      <h1>Inicio</h1>
      <ProductContainer>
        {products.map((product, index) => (
          <ProductCard key={index}>
            <ProductImage src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
          </ProductCard>
        ))}
      </ProductContainer>
    </>
  );
}

const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const ProductCard = styled.div`
  flex: 1 0 20%;
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  box-sizing: border-box;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
`;

export default Home;