import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { message } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const RawProductTab = ({ className }) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editingProduct, setEditingProduct] = useState(false)
  const [productId, setProductId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [image, setImage] = useState({
    name: '',
    base64: '',
  })
  const [formValues, setFormValues] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    quantity: '',
  })

  const nameInputRef = useRef(null)
  const descriptionInputRef = useRef(null)
  const priceInputRef = useRef(null)
  const categoryInputRef = useRef(null)
  const quantityInputRef = useRef(null)

  useEffect(() => {
    getProducts()
    getCategories()
  }, [])

  const getProducts = () => {
    axios.get('/products')
    .then(response => {
      console.log(response.data)
      setProducts(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }
  
  const getCategories = () => {
    axios.get('/categories')
      .then(response => {
        setCategories(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }

  const handleUpdateProducts = () => {
    if (editingProduct) {
      axios.put(`/products/${productId}`, {...formValues, picture: image.base64 })
        .then(response => {
          setIsModalVisible(false)
          setEditingProduct(false)
          getProducts()
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    } else {
      axios.post('/products', {...formValues, picture: image.base64 })
        .then(response => {
          setIsModalVisible(false)
          getProducts()
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
    }
    
  }

  const handleDeleteProducts = (productId) => {
    axios.delete(`/products/${productId}`)
      .then(response => {
        message.success('Producto eliminado con éxito')
        getProducts()
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

  const openModal = (isEditing, product = {}) => {
    setEditingProduct(isEditing)
    if (isEditing) {
      setProductId(product.id)
      setFormValues({ 
        name: product.name, 
        price: product.price, 
        category_id: product.category_id, 
        description: product.description, 
        quantity: product.quantity 
      })
    } else {
      setFormValues({ name: '', price: '', category_id: '', description: '', quantity: '' })
      setImage({ name: '', base64: '' })
    }
    setIsModalVisible(true)
  }

  return (
    <div className={className}>
      <button onClick={() => openModal(false)}>
        <PlusOutlined /> Agregar producto
      </button>
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td><img src={product.picture} alt={product.name} width="50" /></td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{categories.find(cat => cat.id === product.category_id)?.name}</td>
              <td>{product.quantity}</td>
              <td>
                <button onClick={() => openModal(true, product)}>
                  <EditOutlined />
                </button>
                <button onClick={() => handleDeleteProducts(product.id)}>
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
            <h2>{editingProduct ? "Editar producto" : "Agregar producto"}</h2>
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
                <label htmlFor="descripcion">Descripción</label>
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
              <div className="form-item">
                <label htmlFor="precio">Precio</label>
                <input
                  ref={priceInputRef}
                  type="text"
                  id="precio"
                  name="price"
                  value={formValues.price}
                  onChange={(event) => setFormValues({ ...formValues, price: event.target.value })}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="categoria">Categoría</label>
                <select
                  ref={categoryInputRef}
                  id="categoria"
                  name="category_id"
                  value={formValues.category_id}
                  onChange={(event) => setFormValues({ ...formValues, category_id: event.target.value })}
                  required
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-item">
                <label htmlFor="cantidad">Cantidad</label>
                <input
                  ref={quantityInputRef}
                  type="text"
                  id="cantidad"
                  name="quantity"
                  value={formValues.quantity}
                  onChange={(event) => setFormValues({ ...formValues, quantity: event.target.value })}
                  required
                />
              </div>
            </form>
            <button onClick={handleUpdateProducts}>{editingProduct ? "Editar" : "Guardar"}</button>
          </div>
        </div>
      )}
    </div>
  )
}

const ProductTab = styled(RawProductTab)`
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

export default ProductTab