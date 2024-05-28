import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Modal, Form, Radio, message } from 'antd'

const ShoppingCart = () => {
  const token = localStorage.getItem('token')
  const customer = token.split('_')[1]
  const [cart, setCart] = useState({})
  const [lastCart, setLastCart] = useState([])
  const [totalCost, setTotalCost] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [paymentMethodVisible, setPaymentMethodVisible] = useState(false)
  const [form] = Form.useForm()
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""})

  useEffect(() => {
    axios.get(`/orders/${customer}/actual`)
     .then(response => {
        setCart(response.data)
      })
     .catch(error => {
        console.error('There was an error!', error)
      })
  }, [customer])

  useEffect(() => {
    if (cart!= {}) {
      axios.get(`/order-details/${cart.id}`)
       .then(response => {
          setLastCart(response.data)
        })
       .catch(error => {
          console.error('There was an error!', error)
        })
    }
  }, [cart])

  const handleOk = () => {
    form.validateFields().then(values => {
      let paymentMethod = values.paymentMethod
      let status = ''
  
      if (paymentMethod === 'creditCard' || paymentMethod === 'debitCard') {
        if (handlePaymentMethod(customer)) {
          status = 'paid'
        } else {
          setPaymentMethodVisible(true)
          return
        }
      } else if (paymentMethod === 'cash') {
        status = 'cash'
      } else if (paymentMethod === 'store') {
        status = 'store'
      }
  
      axios.put(`/orders/${cart.id}`, {...cart, status: status})
     .then(response => {
        console.log(response.data)
        setIsModalVisible(false)
      })
     .catch(error => {
        console.error('There was an error!', error)
      })
    })
  }

  const handlePaymentMethod = (customer) => {
    axios.get(`/payment-methods/${customer}`)
     .then(response => {
        if (response.data.success){
          message.success('Pago realizado exitosamente')
          return response.data.success
        }
        return response.data.success
      })
     .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showPaymentModal = () => {
    setIsModalVisible(true)
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
    axios.post('/payment-methods', {...paymentMethod,customer_id:customer})
    .then(response => {
      message.success('tarjeta agregada')
      axios.put(`/orders/${cart.id}`, {...cart, status: 'paid'})
      .then(response => {
        console.log(response.data)
        setIsModalVisible(false)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
    setPaymentMethodVisible(false)
  }

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
            setTotalCost(totalCost += product.total_cost)
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
      <Button type="primary" onClick={showPaymentModal}>
        Finalizar compra
      </Button>
      <Modal
        title="Seleccionar método de pago"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="paymentMethod" rules={[{ required: true, message: 'Por favor, seleccione un método de pago.' }]}>
            <Radio.Group>
              <Radio value="creditCard">Tarjeta de crédito</Radio>
              <Radio value="debitCard">Tarjeta de débito</Radio>
              <Radio value="cash">Efectivo</Radio>
              <Radio value="store">En tienda</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
      {paymentMethodVisible&&
        <div>
          <h1>Agregar método de pago</h1>
          <form onSubmit={handleAddPaymentMethod}>
            <input type="text" placeholder="Número de tarjeta" onChange={e => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })} required />
            <input type="text" placeholder="Fecha de vencimiento" onChange={e => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })} required />
            <input type="text" placeholder="CVV" onChange={e => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })} required />
            <button type="submit">Agregar método de pago</button>
          </form>
        </div>
      }
    </div>
  )
}

export default ShoppingCart