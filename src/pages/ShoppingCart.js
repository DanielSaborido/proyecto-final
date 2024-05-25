import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ShoppingCart = () => {
  const token = localStorage.getItem('token')
  const customer = token.split('_')[1]
  const [carts, setCarts] = useState([])
  const [lastCart, setLastCart] = useState([])
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    axios.get(`/orders/${customer}`)
      .then(response => {
        setCarts(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }, [customer])

  useEffect(() => {
    if (carts.length !== 0){
      axios.get(`/order-details/${carts[carts.length-1].id}`)
      .then(response => {
        setLastCart(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    }
  }, [carts])

  return (
    <div>
      <h1>Carrito</h1>
      <table>
        <thead>
          <tr>Producto</tr>
          <tr>Cantidad</tr>
          <tr>Precio</tr>
        </thead>
        <tbody>
            {lastCart.map((product) => {
              setTotalCost(totalCost+=(product.total_cost))
              return (
                <tr key={product.id}>
                  <td>{product.product_name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.total_cost}</td>
                </tr>
              )
            })}
          <tr>
            <td colSpan={3}>Coste total: {totalCost}€</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ShoppingCart
