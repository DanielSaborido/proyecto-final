import React, { useState, useEffect } from 'eact'
import { Table, Modal, Form, Input, Button, message } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const ProductTab = () => {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [formValues, setFormValues] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    quantity: '',
  })
  const [image, setImage] = useState({
    name: '',
    base64: '',
  })

  useEffect(() => {
    axios.get('/products')
    .then(response => {
      setProducts(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }, [])

  const handleUpdateProducts = (event) => {
    event.preventDefault()
    if (editingProduct) {
      axios.put(`/products/${editingProduct.id}`, {...formValues, picture: image.base64 })
      .then(response => {
        setIsModalVisible(false)
        setEditingProduct(null)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    } else {
      axios.post('/products', {...formValues, picture: image.base64 })
      .then(response => {
        setIsModalVisible(false)
        setProducts([...products, response.data])
        setEditingProduct(null)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    }
  }

  const handleDeleteProducts = (productId) => {
    axios.delete(`/products/${productId}`)
    .then(response => {
      message.success('Producto eliminado con exito')
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
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setIsModalVisible(true); setEditingProduct(null) }}>
        Agregar producto
      </Button>
      <Table columns={[
        { title: 'Nombre', dataIndex: 'name' },
        { title: 'Descripción', dataIndex: 'description' },
        { title: 'Precio', dataIndex: 'price' },
        { title: 'Categoría', dataIndex: 'category_id' },
        { title: 'Cantidad', dataIndex: 'quantity' },
        { title: 'Acciones', render: (product) => (
          <div>
            <button onClick={() => { setEditingProduct(product); setIsModalVisible(true) }}><EditOutlined /></button>
            <button onClick={() => handleDeleteProducts(product.id)}><DeleteOutlined /></button>
          </div>
        ) }
      ]} dataSource={products} />
      {isModalVisible && (
        <Modal title={editingProduct? "Editar producto" : "Agregar producto"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)}>
          <Form onSubmit={handleUpdateProducts}>
            <Form.Item label="Imagen">
              <Input type="file" onChange={handleImageChange} />
            </Form.Item>
            <Form.Item label="Nombre">
              <Input name="name" value={formValues.name} onChange={(event) => setFormValues({...formValues, name: event.target.value })} required />
            </Form.Item>
            <Form.Item label="Descripción">
              <Input name="description" value={formValues.price} onChange={(event) => setFormValues({...formValues, price: event.target.value })} required />
            </Form.Item>
            <Form.Item label="Precio">
              <Input name="price" value={formValues.price} onChange={(event) => setFormValues({...formValues, price: event.target.value })} required />
            </Form.Item>
            <Form.Item label="Categoría">
              <Input name="category_id" value={formValues.category_id} onChange={(event) => setFormValues({...formValues, category_id: event.target.value })} required />
            </Form.Item>
            <Form.Item label="Cantidad">
              <Input name="quantity" value={formValues.name} onChange={(event) => setFormValues({...formValues, name: event.target.value })} required />
            </Form.Item>
            <Button type="submit">Guardar</Button>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default ProductTab