import React, { useState, useEffect, useRef } from 'react'
import { message } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const RawUserTab = ({ className }) => {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(false)
  const [userId, setUserId] = useState(null)
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

  const nameInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const phoneInputRef = useRef(null)
  const adminInputRef = useRef(null)

  useEffect(() => {
    axios.get('/users')
    .then(response => {
      setUsers(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }, [])

  const handleUpdateUsers = () => {
    if (editingUser) {
      axios.put(`/users/${userId}`, {...formValues, picture: image.base64 })
        .then(response => {
          axios.get('/users')
            .then(response => {
              setUsers(response.data)
            })
            .catch(error => {
              console.error('There was an error!', error)
            })
          setIsModalVisible(false)
          setEditingUser(false)
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    } else {
      axios.post('/users', {...formValues, picture: image.base64 })
        .then(response => {
          setIsModalVisible(false)
          setUsers([...users, response.data])
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    }
    
  }

  const handleDeleteUsers = (userId) => {
    axios.delete(`/users/${userId}`)
    .then(response => {
      message.success('Usuario eliminado con éxito')
      axios.get('/users')
      .then(response => {
        setUsers(response.data)
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

  const openModal = (isEditing, user = {}) => {
    setEditingUser(isEditing)
    if (isEditing) {
      setUserId(user.id)
      setFormValues({ 
        name: user.name, 
        email: user.email, 
        password: user.password, 
        phone: user.phone, 
        admin: user.admin 
      })
    } else {
      setFormValues({ name: '', email: '', password: '', phone: '', admin: 0 })
      setImage({ name: '', base64: '' })
    }
    setIsModalVisible(true)
  }

  return (
    <div className={className}>
      <button onClick={() => openModal(false)}>
        <PlusOutlined /> Agregar usuario
      </button>
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><img src={user.picture} alt={user.name} width="50" /></td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button onClick={() => { setEditingUser(true); setUserId(user.id); setIsModalVisible(true); setFormValues(user) }}>
                  <EditOutlined />
                </button>
                <button onClick={() => handleDeleteUsers(user.id)}>
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
            <h2>{editingUser ? "Editar usuario" : "Agregar usuario"}</h2>
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
                <label htmlFor="admin">Administrador</label>
                <input
                  ref={adminInputRef}
                  type="checkbox"
                  id="admin"
                  name="admin"
                  checked={formValues.admin}
                  onChange={(event) => setFormValues({ ...formValues, admin: event.target.checked })}
                />
              </div>
            </form>
            <button onClick={handleUpdateUsers}>{editingUser ? "Editar" : "Guardar"}</button>
          </div>
        </div>
      )}
    </div>
  )
}

const UserTab = styled(RawUserTab)`
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 1rem;
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
    font-size: 1rem;
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

export default UserTab