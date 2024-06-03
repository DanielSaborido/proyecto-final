import React, { useState, useEffect } from 'react'
import { Table, Modal, Form, Input, Button, Checkbox, message } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const UserTab = () => {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [image, setImage] = useState({
    name: '',
    base64: '',
  })
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    admin: 0
  })

  useEffect(() => {
    axios.get('http://api-proyecto-final.test/api/users')
    .then(response => {
      setUsers(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }, [])

  const handleUpdateUsers = () => {
    if (editingUser) {
      axios.put(`http://api-proyecto-final.test/api/users/${editingUser.id}`, {...formValues, picture: image.base64 })
      .then(response => {
        setIsModalVisible(false)
        setEditingUser(null)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    } else {
      axios.post('http://api-proyecto-final.test/api/users', {...formValues, picture: image.base64 })
      .then(response => {
        setIsModalVisible(false)
        setUsers([...users, response.data])
        setEditingUser(null)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    }
  }

  const handleDeleteUsers = (userId) => {
    axios.delete(`http://api-proyecto-final.test/api/users/${userId}`)
    .then(response => {
      message.success('Usuario eliminado con exito')
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
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setIsModalVisible(true); setEditingUser(null) }}>
        Agregar usuario
      </Button>
      <Table columns={[
        { title: 'Imagen', dataIndex: 'picture' },
        { title: 'Nombre', dataIndex: 'name' },
        { title: 'Correo electrónico', dataIndex: 'email' },
        { title: 'Teléfono', dataIndex: 'phone' },
        { title: 'Acciones', render: (user) => (
          <div>
            <button onClick={() => { setEditingUser(user); setIsModalVisible(true) }}><EditOutlined /></button>
            <button onClick={() => handleDeleteUsers(user.id)}><DeleteOutlined /></button>
          </div>
        ) }
      ]} dataSource={users} />
      {isModalVisible && (
        <Modal title={editingUser? "Editar usuario" : "Agregar usuario"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)}>
          <Form>
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
            <Form.Item label="Administrador">
              <Checkbox name="admin" checked={formValues.admin} onChange={(event) => setFormValues({...formValues, admin: event.target.checked })} />
            </Form.Item>
            <Button type="submit" onClick={() => handleUpdateUsers}>Guardar</Button>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default UserTab