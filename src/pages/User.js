import React, { useEffect, useState } from 'react'
import axios from 'axios'

const User = ({userId}) => {
  const [user, setUser] = useState({})
  const [orders, setOrders] = useState([])
  const [totalCost, setTotalCost] = useState(0)
  const [orderDetails, setOrderDetails] = useState([])
  const [orderId, setOrderId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

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

  return (
    <>
      <section>
        <img src={user.picture}/>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </section>
      <section>
        <ul>
          {orders.map((order) => {
            return <li key={order.id} onClick={()=>{setIsModalVisible(true);setOrderId(order.id)}}>{order.order_date} - {order.status}</li>
          })}
        </ul>
      </section>
      {isModalVisible && (
        <Modal title={'Detalles de la orden'} visible={isModalVisible} onCancel={() => {setIsModalVisible(false);setTotalCost(0)}}>
          <table>
            <thead></thead>
            <tbody>
                {orderDetails.map((product) => {
                  setTotalCost(totalCost+=(product.quantity*product.unit_price))
                  return (
                    <tr key={product.id}>
                      <td>{product.product_name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.unit_price}</td>
                    </tr>
                  )
                })}
              <tr>
                <td>Coste total: {totalCost}€</td>
              </tr>
            </tbody>
          </table>
        </Modal>
      )}
    </>
  )
}

export default User
