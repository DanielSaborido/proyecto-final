import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ShoppingCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('/cart')
      .then(response => {
        setCart(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      <h1>Carrito</h1>
    </div>
  );
}

export default ShoppingCart;
