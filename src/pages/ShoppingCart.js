import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Radio, message } from 'antd';
import styled from 'styled-components';

const RawShoppingCart = ({className}) => {
  const token = localStorage.getItem('token');
  const customer = token.split('_')[1];
  const [cart, setCart] = useState({});
  const [lastCart, setLastCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentMethodVisible, setPaymentMethodVisible] = useState(false);
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState({
    card_number: null,
    expiry_date: null,
    cvv: null
  });

  useEffect(() => {
    axios.get(`/orders/${customer}/actual`)
      .then(response => {
        setCart(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [customer]);

  useEffect(() => {
    if (cart && Object.keys(cart).length > 0) {
      axios.get(`/order-details/${cart.id}`)
        .then(response => {
          setLastCart(response.data);
          const total = response.data.reduce((sum, product) => sum + product.total_cost, 0);
          setTotalCost(total);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
  }, [cart]);

  const handleOk = () => {
    form.validateFields().then(values => {
      let paymentMethod = values.paymentMethod;
      let status = '';

      if (paymentMethod === 'creditCard' || paymentMethod === 'debitCard') {
        if (handlePaymentMethod(customer)) {
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

      axios.put(`/orders/${cart.id}`, { ...cart, status: status, total:totalCost })
        .then(response => {
          console.log(response.data);
          setIsModalVisible(false);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    });
  };

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

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showPaymentModal = () => {
    setIsModalVisible(true);
  };

  const handleAddPaymentMethod = (event) => {
    event.preventDefault();
    const { cardNumber, expiryDate, cvv } = paymentMethod;
    if (!cardNumber || !expiryDate || !cvv) {
      message.error('Por favor, complete todos los campos');
      return;
    }

    const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
    if (!cardNumberRegex.test(cardNumber)) {
      message.error('Número de tarjeta no válido');
      setPaymentMethod({ ...paymentMethod, cardNumber: '' });
      return;
    }

    const expiryDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    if (!expiryDateRegex.test(expiryDate)) {
      message.error('Fecha de vencimiento no válida (MM/YY)');
      setPaymentMethod({ ...paymentMethod, expiryDate: '' });
      return;
    }

    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(cvv)) {
      message.error('CVV no válido');
      setPaymentMethod({ ...paymentMethod, cvv: '' });
      return;
    }

    axios.post('/payment-methods', { ...paymentMethod, customer_id: customer })
      .then(response => {
        message.success('Tarjeta agregada');
        axios.put(`/orders/${cart.id}`, { ...cart, status: 'paid' })
          .then(response => {
            console.log(response.data);
            setIsModalVisible(false);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
    setPaymentMethodVisible(false);
  };

  return (
    <div className={className}>
      <h1>Carrito</h1>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {lastCart.map(product => (
            <tr key={product.id}>
              <td>{product.product_name}</td>
              <td>{product.quantity}</td>
              <td>{product.total_cost}</td>
            </tr>
          ))}
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
      {paymentMethodVisible && (
        <div className='modal'>
          <div className='modal-contenido'>
            <span className='cerrar' onClick={()=>setPaymentMethodVisible(false)}>X</span>
            <h2>Agregar método de pago</h2>
            <form onSubmit={handleAddPaymentMethod}>
              <input type="text" placeholder="Número de tarjeta" onChange={e => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })} required />
              <input type="text" placeholder="Fecha de vencimiento" onChange={e => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })} required />
              <input type="text" placeholder="CVV" onChange={e => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })} required />
              <button type="submit">Agregar método de pago</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const ShoppingCart = styled(RawShoppingCart)`
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
`;

export default ShoppingCart;
