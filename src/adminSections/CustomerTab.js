import React, { useState, useEffect } from 'react'
import { Table, Modal, Form, Input, Button, message } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const CustomerTab = () => {
  const [customers, setCustomers] = useState([])
  const [editingCustomer, setEditingCustomer] = useState(null)
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

  useEffect(() => {
    axios.get('/customers')
    .then(response => {
      setCustomers(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }, [])

  const handleUpdateCustomers = (event) => {
    event.preventDefault()
    if (editingCustomer) {
      axios.put(`/customers/${editingCustomer.id}`, {...formValues, picture: image.base64 })
      .then(response => {
        setIsModalVisible(false)
        setEditingCustomer(null)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    } else {
      axios.post('/customers', {...formValues, picture: image.base64 })
      .then(response => {
        setIsModalVisible(false)
        setCustomers([...customers, response.data])
        setEditingCustomer(null)
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

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setIsModalVisible(true); setEditingCustomer(null) }}>
        Agregar cliente
      </Button>
      <Table columns={[
        { title: 'Imagen', dataIndex: 'picture' },
        { title: 'Nombre', dataIndex: 'name' },
        { title: 'Correo electrónico', dataIndex: 'email' },
        { title: 'Teléfono', dataIndex: 'phone' },
        { title: 'Direccion', dataIndex: 'address' },
        { title: 'Acciones', render: (customer) => (
          <div>
            <button onClick={() => { setEditingCustomer(customer); setIsModalVisible(true) }}><EditOutlined /></button>
            <button onClick={() => handleDeleteCustomers(customer.id)}><DeleteOutlined /></button>
          </div>
        ) }
      ]} dataSource={customers} />
      {isModalVisible && (
        <Modal title={editingCustomer? "Editar cliente" : "Agregar cliente"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)}>
          <Form onSubmit={handleUpdateCustomers}>
            <Form.Item label="Imagen">
              <Input type="file" onChange={handleImageChange} />
            </Form.Item>
            <Form.Item label="Nombre">
              <Input name="name" value={formValues.name} onChange={(event) => setFormValues({...formValues, name: event.target.value })} required />
            </Form.Item>
            <Form.Item label="Correo electrónico">
              <Input name="email" value={formValues.email} onChange={(event) => setFormValues({...formValues, email: event.target.value })} required />
            </Form.Item>
            <Form.Item label="Contraseña">
              <Input name="password" value={formValues.password} onChange={(event) => setFormValues({...formValues, password: event.target.value })} required />
            </Form.Item>
            <Form.Item label="Teléfono">
              <Input name="phone" value={formValues.phone} onChange={(event) => setFormValues({...formValues, phone: event.target.value })} required />
            </Form.Item>
            <Form.Item label="Direccion">
              <Input name="address" value={formValues.address} onChange={(event) => setFormValues({...formValues, address: event.target.value })} required />
            </Form.Item>
            <Button type="submit">Guardar</Button>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default CustomerTab