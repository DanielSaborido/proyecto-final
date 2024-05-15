import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShoppingCart = ({customer}) => {
  const [carts, setCarts] = useState([]);
  const [lastCart, setLastCart] = useState([]);

  useEffect(() => {
    axios.get(`/orders/${customer}`)
      .then(response => {
        setCarts(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [customer]);

  useEffect(() => {
    axios.get(`/order-details/${carts[carts.length-1].id}`)
      .then(response => {
        setLastCart(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [carts]);

  return (
    <div>
      <h1>Carrito</h1>
      <ul>
        {lastCart.map((item, index) => (
          <li key={index}>
            <span>Producto ID: {item.product_id}</span>
            <span>Precio: {item.price}</span>
            <span>Cantidad: {item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingCart;
