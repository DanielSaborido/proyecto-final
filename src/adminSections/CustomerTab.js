import React, { useState, useEffect, useRef } from 'react'
import { Table, Modal, Form, Input, Button, message } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const RawCustomerTab = ({ className }) => {
  const [customers, setCustomers] = useState([])
  const [editingCustomer, setEditingCustomer] = useState(false)
  const [customerId, setCustomerId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [image, setImage] = useState({
    name: '',
    base64: '',
  })
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  })
  
  const nameInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const phoneInputRef = useRef(null)
  const addressInputRef = useRef(null)
  const passwordInputRef = useRef(null)

  useEffect(() => {
    axios.get('/customers')
    .then(response => {
      setCustomers(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }, [])

  const handleUpdateCustomers = () => {
    if (editingCustomer) {
      axios.put(`/customers/${customerId}`, {...formValues, picture: image.base64 })
      .then(response => {
        axios.get('/customers')
        .then(response => {
          setCustomers(response.data)
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
        setIsModalVisible(false)
        setEditingCustomer(false)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    } else {
      axios.post('/customers', {...formValues, picture: image.base64 })
      .then(response => {
        setIsModalVisible(false)
        setCustomers([...customers, response.data])
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    }
  }

  const handleDeleteCustomers = (customerId) => {
    axios.delete(`/customers/${customerId}`)
    .then(response => {
      message.success('Cliente eliminado con exito')
      axios.get('/customers')
      .then(response => {
        setCustomers(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage({
        name: file.name,
        base64: reader.result,
      })
    }
    reader.readAsDataURL(file)
  }

  const openModal = (isEditing, customer = {}) => {
    setEditingCustomer(isEditing)
    if (isEditing) {
      setCustomerId(customer.id)
      setFormValues({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, password: customer.password })
    } else {
      setFormValues({ name: '', email: '', phone: '', address: '', password: '' })
      setImage({ name: '', base64: '' })
    }
    setIsModalVisible(true)
  }

  return (
    <div className={className}>
      <button onClick={() => openModal(false)}>
        <PlusOutlined /> Agregar cliente
      </button>
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td><img src={customer.picture} alt={customer.name} width="50" /></td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <button onClick={() => { setEditingCustomer(true); setCustomerId(customer.id); setIsModalVisible(true); setFormValues(customer) }}>
                  <EditOutlined />
                </button>
                <button onClick={() => handleDeleteCustomers(customer.id)}>
                  <DeleteOutlined />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalVisible && (
        <div className='modal'>
          <div className='modal-contenido'>
            <span className='cerrar' onClick={() => setIsModalVisible(false)}>X</span>
            <h2>{editingCustomer ? "Editar cliente" : "Agregar cliente"}</h2>
            <form>
              <div className="form-item">
                <label htmlFor="imagen">Imagen</label>
                <input type="file" id="imagen" onChange={handleImageChange} />
              </div>
              <div className="form-item">
                <label htmlFor="nombre">Nombre</label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="nombre"
                  name="name"
                  value={formValues.name}
                  onChange={(event) => setFormValues({ ...formValues, name: event.target.value })}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  ref={emailInputRef}
                  type="text"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={(event) => setFormValues({ ...formValues, email: event.target.value })}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="phone">Teléfono</label>
                <input
                  ref={phoneInputRef}
                  type="text"
                  id="phone"
                  name="phone"
                  value={formValues.phone}
                  onChange={(event) => setFormValues({ ...formValues, phone: event.target.value })}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="address">Dirección</label>
                <input
                  ref={addressInputRef}
                  type="text"
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={(event) => setFormValues({ ...formValues, address: event.target.value })}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="password">Contraseña</label>
                <input
                  ref={passwordInputRef}
                  type="password"
                  id="password"
                  name="password"
                  value={formValues.password}
                  onChange={(event) => setFormValues({ ...formValues, password: event.target.value })}
                  required
                />
              </div>
            </form>
            <button onClick={handleUpdateCustomers}>{editingCustomer ? "Editar" : "Guardar"}</button>
          </div>
        </div>
      )}
    </div>
  )
}

const CustomerTab = styled(RawCustomerTab)`
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
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
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
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
}

.form-item input[type="text"],
.form-item input[type="file"] {
  width: 100%;
  padding: 8px;
  line-height: 20px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-item input[type="text"]:focus,
.form-item input[type="file"]:focus {
  outline: none;
  border-color: #4d90fe;
}
`;

export default CustomerTab