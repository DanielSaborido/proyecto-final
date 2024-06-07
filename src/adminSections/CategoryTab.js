import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const RawCategoryTab = ({ className }) => {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(false)
  const [categoryId, setCategoryId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [image, setImage] = useState({ name: '', base64: '' })
  const [formValues, setFormValues] = useState({ name: '', description: '' })

  const nameInputRef = useRef(null)
  const descriptionInputRef = useRef(null)

  useEffect(() => {
    axios.get('/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('There was an error!', error))
  }, [])

  const handleUpdateCategories = () => {
    const categoryData = { ...formValues, picture: image.base64 }
    if (editingCategory) {
      axios.put(`/categories/${categoryId}`, categoryData)
        .then(response => {
          axios.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('There was an error!', error))
          setIsModalVisible(false)
          setEditingCategory(false)
        })
        .catch(error => console.error('There was an error!', error))
    } else {
      axios.post('/categories', categoryData)
        .then(response => {
          setIsModalVisible(false)
          setCategories([...categories, response.data])
        })
        .catch(error => console.error('There was an error!', error))
    }
  }

  const handleDeleteCategories = (categoryId) => {
    axios.delete(`/categories/${categoryId}`)
      .then(response => {
        axios.get('/categories')
          .then(response => setCategories(response.data))
          .catch(error => console.error('There was an error!', error))
      })
      .catch(error => console.error('There was an error!', error))
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage({ name: file.name, base64: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const openModal = (isEditing, category = {}) => {
    setEditingCategory(isEditing)
    if (isEditing) {
      setCategoryId(category.id)
      setFormValues({ name: category.name, description: category.description })
    } else {
      setFormValues({ name: '', description: '' })
      setImage({ name: '', base64: '' })
    }
    setIsModalVisible(true)
  }

  return (
    <div className={className}>
      <button type="button" onClick={() => openModal(false)}>
        <PlusOutlined /> Agregar categoría
      </button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td><img src={category.picture} alt={category.name} width="50" /></td>
              <td>
                <button onClick={() => openModal(true, category)}><EditOutlined /></button>
                <button onClick={() => handleDeleteCategories(category.id)}><DeleteOutlined /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalVisible && (
        <div className='modal'>
          <div className='modal-contenido'>
            <span className='cerrar' onClick={() => setIsModalVisible(false)}>X</span>
            <h2>{editingCategory ? "Editar categoría" : "Agregar categoría"}</h2>
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
                <label htmlFor="descripcion">Descripcion</label>
                <input
                  ref={descriptionInputRef}
                  type="text"
                  id="descripcion"
                  name="description"
                  value={formValues.description}
                  onChange={(event) => setFormValues({ ...formValues, description: event.target.value })}
                  required
                />
              </div>
            </form>
            <button onClick={handleUpdateCategories}>{editingCategory ? "Editar" : "Guardar"}</button>
          </div>
        </div>
      )}
    </div>
  )
}

const CategoryTab = styled(RawCategoryTab)`
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

export default CategoryTab;