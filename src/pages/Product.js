import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Product = ({product}) => {
  const [productData, setProductData] = useState();

  useEffect(() => {
    axios.get(`/products/${product}`)
      .then(response => {
        setProductData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [product]);

  return (
    <div>
      <h2>{productData.name}</h2>
      <p>{productData.description}</p>
      <p>Price: ${productData.price}</p>
    </div>
  );
}

export default Product;
