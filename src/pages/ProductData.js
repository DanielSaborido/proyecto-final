import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Product = () => {
  const { id } = useParams()
  const [productData, setProductData] = useState();

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(response => {
        setProductData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id]);

  return (
    <div>
      <h2>{productData.name}</h2>
      <p>{productData.description}</p>
      <p>Price: ${productData.price}</p>
    </div>
  );
}

export default Product;
