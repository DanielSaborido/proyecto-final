import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { message, Avatar } from 'antd'
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';

const RawUser = ({ className }) => {
  const token = (localStorage.getItem('token')).split('_');
  const userId = token[1]
  const [user, setUser] = useState({})
  const [orders, setOrders] = useState([])
  const [totalCost, setTotalCost] = useState(0)
  const [orderDetails, setOrderDetails] = useState([])
  const [orderId, setOrderId] = useState(null)
  const [cart, setCart] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalCompraVisible, setIsModalCompraVisible] = useState(false)
  const [paymentMethodVisible, setPaymentMethodVisible] = useState(false)
  const [formData, setFormData] = useState({
    paymentMethod: '',
  });
  const [paymentMethod, setPaymentMethod] = useState({
    card_number: null,
    expiry_date: null,
    cvv: null})

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

  useEffect(() => {
    if (orderDetails) {
      const total = orderDetails.reduce((sum, product) => sum + product.total_cost, 0);
      setTotalCost(parseFloat(total).toFixed(2));
    }
  }, [orderDetails])

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
    
    axios.get(`/orders/${userId}/actual`)
      .then(response => {
        setCart(response.data.order);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  const getOrderDetails = async() => {
    console.log(orderId)
    await axios.get(`/order-details/${orderId}`)
    .then(response => {
      const data = response.data.map(product => ({
        ...product,
        total_cost: parseFloat(product.total_cost).toFixed(2)
      }));
      setOrderDetails(data);
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const handleAddPaymentMethod = () => {
    const { card_number, expiry_date, cvv} = paymentMethod
    if (!card_number ||!expiry_date ||!cvv) {
      message.error("Por favor, complete todos los campos")
      return
    }

    const card_numberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11})$/
    if (!card_numberRegex.test(card_number)) {
      message.error("Número de tarjeta no válido")
      setPaymentMethod({ ...paymentMethod, card_number: null })
      return
    }
  
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/
    if (!expiryDateRegex.test(expiry_date)) {
      message.error("Fecha de vencimiento no válida (MM/YY)")
      setPaymentMethod({ ...paymentMethod, expiry_date: null })
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

  const abrirModal = () => {
    setIsModalVisible(true)
  }

  const cerrarModal = () => {
    setIsModalVisible(false)
    setIsModalCompraVisible(false)
    setPaymentMethodVisible(false)
  }

  const handlePaymentMethod = async(customer) => {
    return await axios.get(`/payment-methods/${customer}`)
      .then(response => {
        if (response.data.success) {
          message.success('Pago realizado exitosamente');
          return response.data.success;
        }
        return response.data.success;
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleOk = () => {
    let paymentMethod = formData.paymentMethod;
    let status = '';
  
    if (!paymentMethod) {
      console.error('Por favor, seleccione un método de pago.');
      return;
    }
  
    if (paymentMethod === 'creditCard' || paymentMethod === 'debitCard') {
      if (handlePaymentMethod(userId)) {
        status = 'paid';
      } else {
        setPaymentMethodVisible(true);
        return;
      }
    } else if (paymentMethod === 'cash') {
      status = 'cash';
    } else if (paymentMethod === 'store') {
      status = 'store';
    }
  
    axios.put(`/orders/${cart.id}`, { ...cart, status: status, total: totalCost })
      .then(response => {
        console.log(response.data);
        setIsModalVisible(false);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const showPaymentModal = () => {
    setIsModalCompraVisible(true);
  };

  return (
    <div className={className}>
      <section>
        <Avatar
          icon={!user.picture || user.picture === "data:application/x-empty;base64," ? <UserOutlined /> : null}
          src={user.picture && user.picture !== "data:application/x-empty;base64," ? user.picture : null}
          size={125}
        />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button onClick={() => setPaymentMethodVisible(true)}>Agregar metodo de pago</button>
      </section>
      <section>
        <ul>
          {orders.map((order) => {
            return <li key={order.id} onClick={()=>{setOrderId(order.id);abrirModal()}}>{order.order_date} - {order.status}</li>
          })}
        </ul>
      </section>
      {paymentMethodVisible&&
        <div className='modal'>
          <div className='modal-contenido'>
            <span className='cerrar' onClick={cerrarModal}>X</span>
            <h2>Agregar método de pago</h2>
            <form>
              <input type="text" placeholder="Número de tarjeta" onChange={e => setPaymentMethod({ ...paymentMethod, card_number: e.target.value })} required />
              <input type="text" placeholder="Fecha de vencimiento" onChange={e => setPaymentMethod({ ...paymentMethod, expiry_date: e.target.value })} required />
              <input type="text" placeholder="CVV" onChange={e => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })} required />
              <button onClick={(event)=>{event.preventDefault();handleAddPaymentMethod()}}>Agregar método de pago</button>
            </form>
          </div>
        </div>
      }
      {isModalCompraVisible && (
        <div className='modal'>
          <div className='modal-contenido'>
            <span className='cerrar' onClick={cerrarModal}>X</span>
            <h2>Seleccionar método de pago</h2>
            <form onSubmit={()=>handleOk()}>
              <div className="form-item">
                <label>Método de pago:</label>
                <div className="radio-group">
                  <input type="radio" id="creditCard" name="paymentMethod" value="creditCard" onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} required />
                  <label htmlFor="creditCard">Tarjeta de crédito</label>
                  <input type="radio" id="debitCard" name="paymentMethod" value="debitCard" onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} required />
                  <label htmlFor="debitCard">Tarjeta de débito</label>
                  <input type="radio" id="cash" name="paymentMethod" value="cash" onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} required />
                  <label htmlFor="cash">Efectivo</label>
                  <input type="radio" id="store" name="paymentMethod" value="store" onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} required />
                  <label htmlFor="store">En tienda</label>
                </div>
              </div>
              <button type="submit">Confirmar pago</button>
            </form>
          </div>
        </div>
      )}
      {isModalVisible && (
        <div className='modal'>
          <div className='modal-contenido'>
            <span className='cerrar' onClick={cerrarModal}>X</span>
            <h2>Detalles de la orden</h2>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                  {orderDetails?.map((product) => {
                    return (
                      <tr key={product.id}>
                        <td>{product.product_name}</td>
                        <td>{product.quantity} kg</td>
                        <td>{product.total_cost} €</td>
                      </tr>
                    )
                  })}
                <tr>
                  <td colSpan={3}>Coste total: {totalCost} €</td>
                </tr>
              </tbody>
            </table>
            {orderId===cart.id&& <button onClick={()=>showPaymentModal()}>Finalizar compra</button>}
          </div>
        </div>
      )}
    </div>
  )
}

const User = styled(RawUser)`
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }

  thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
  }

  td {
    padding: 12px 15px;
  }

  tbody tr:nth-child(even) {
    background-color: #f3f3f3;
  }

  tbody tr:last-child {
    font-weight: bold;
    font-size: 1.1em;
  }
  
  .modal {
    display: block; /* Change to block to show modal for demo purposes */
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
  }

  .modal-contenido {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  .cerrar {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .cerrar:hover,
  .cerrar:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  .form-item {
    margin-bottom: 16px;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
  }

  .radio-group label {
    margin-left: 8px;
  }
`;

export default User
