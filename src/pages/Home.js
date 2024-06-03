import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const RawHome = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductosTemporada()
  }, []);

  const getProductosTemporada = async() =>{
    await axios.get('http://api-proyecto-final.test/api/products/list/1')
    .then(response => {
      setProducts(response.data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }

  return (
    <>
      <h1>Inicio</h1>
      <section className="products">
        {products?.map((product, index) => (
          <div key={index} className="product_card" onClick={() => navigate(`/products/${product.id}`)}>
            <img src={product.image} alt={product.name} className="product_image" />
            <h2>{product.name}</h2>
          </div>
        ))}
      </section>
    </>
  );
}

const Home = styled(RawHome)`
.products {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

.product_card {
    flex: 1 0 20%;
    border: 1px solid black;
    margin: 10px;
    padding: 10px;
    box-sizing: border-box;
  }

.product_image {
    width: 100px;
    height: 100px;
  }
`;

export default Home;