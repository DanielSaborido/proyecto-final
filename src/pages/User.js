import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Modal, Form, Radio, message } from 'antd'

const User = ({}) => {
  const token = (localStorage.getItem('token')).split('_');
  const userId = token[1];
  const [user, setUser] = useState({})
  const [orders, setOrders] = useState([])
  const [totalCost, setTotalCost] = useState(0)
  const [orderDetails, setOrderDetails] = useState([])
  const [orderId, setOrderId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [paymentMethodVisible, setPaymentMethodVisible] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""})

  useEffect(() => {
    if (userId) {
      getUser()
      getOrders()
    }
  }, [userId])

  useEffect(() => {
    if (orderId) {
      getOrderDetails()
    }
  }, [orderId])

  const getUser = async() => {
    await axios.get(`/customers/${userId}`)
    .then(response => {
      setUser(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const getOrders = async() => {
    await axios.get(`/orders/${userId}`)
    .then(response => {
      setOrders(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const getOrderDetails = async() => {
    await axios.get(`/order-details/${orderId}`)
    .then(response => {
      setOrderDetails(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const handleAddPaymentMethod = (event) => {
    event.preventDefault()
    const { cardNumber, expiryDate, cvv} = paymentMethod
    if (!cardNumber ||!expiryDate ||!cvv) {
      message.error("Por favor, complete todos los campos")
      return
    }

    const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11})$/
    if (!cardNumberRegex.test(cardNumber)) {
      message.error("Número de tarjeta no válido")
      setPaymentMethod({ ...paymentMethod, cardNumber: null })
      return
    }
  
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/
    if (!expiryDateRegex.test(expiryDate)) {
      message.error("Fecha de vencimiento no válida (MM/YY)")
      setPaymentMethod({ ...paymentMethod, expiryDate: null })
      return
    }
  
    const cvvRegex = /^[0-9]{3,4}$/
    if (!cvvRegex.test(cvv)) {
      message.error("CVV no válido")
      setPaymentMethod({ ...paymentMethod, cvv: null })
      return
    }
    axios.post('/payment-methods', {...paymentMethod,customer_id:userId})
    .then(response => {
      message.success('tarjeta agregada')
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
    setPaymentMethodVisible(false)
  }

  return (
    <>
      <section>
        <img src={user.picture}/>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button onClick={() => setPaymentMethodVisible(true)}>Agregar metodo de pago</button>
      </section>
      <section>
        <ul>
          {orders.map((order) => {
            return <li key={order.id} onClick={()=>{setIsModalVisible(true);setOrderId(order.id)}}>{order.order_date} - {order.status}</li>
          })}
        </ul>
      </section>
      {paymentMethodVisible&&
        <div>
          <h1>Agregar método de pago</h1>
          <form>
            <input type="text" placeholder="Número de tarjeta" onChange={e => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })} required />
            <input type="text" placeholder="Fecha de vencimiento" onChange={e => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })} required />
            <input type="text" placeholder="CVV" onChange={e => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })} required />
            <button onClick={(e)=>{e.preventDefault();handleAddPaymentMethod()}}>Agregar método de pago</button>
          </form>
        </div>
      }
      {isModalVisible && (
        <Modal title={'Detalles de la orden'} visible={isModalVisible} onCancel={() => {setIsModalVisible(false);setTotalCost(0)}}>
          <table>
            <thead>
              <tr>Producto</tr>
              <tr>Cantidad</tr>
              <tr>Precio</tr>
            </thead>
            <tbody>
                {orderDetails.map((product) => {
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
        </Modal>
      )}
    </>
  )
}

export default User
