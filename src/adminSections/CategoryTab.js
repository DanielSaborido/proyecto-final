import React, { useState, useEffect } from 'react'
import { Table, Modal, Form, Input, Button, message } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const CategoryTab = () => {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [image, setImage] = useState({
    name: '',
    base64: '',
  })
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    axios.get('http://api-proyecto-final.test/api/categories')
    .then(response => {
      setCategories(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }, [])

  const handleUpdateCategories = () => {
    if (editingCategory) {
      axios.put(`http://api-proyecto-final.test/api/categories/${editingCategory.id}`, {...formValues, picture: image.base64 })
      .then(response => {
        setIsModalVisible(false)
        setEditingCategory(null)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    } else {
      axios.post('http://api-proyecto-final.test/api/categories', {...formValues, picture: image.base64 })
      .then(response => {
        setIsModalVisible(false)
        setCategories([...categories, response.data])
        setEditingCategory(null)
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
    }
  }

  const handleDeleteCategories = (categoryId) => {
    axios.delete(`http://api-proyecto-final.test/api/categories/${categoryId}`)
    .then(response => {
      message.success('Categoría eliminada con exito')
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
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setIsModalVisible(true); setEditingCategory(null) }}>
        Agregar categoría
      </Button>
      <Table columns={[
        { title: 'Nombre', dataIndex: 'name' },
        { title: 'Descripcion', dataIndex: 'description' },
        { title: 'Imagen', dataIndex: 'picture' },
        { title: 'Acciones', render: (category) => (
          <div>
            <button onClick={() => { setEditingCategory(category); setIsModalVisible(true) }}><EditOutlined /></button>
            <button onClick={() => handleDeleteCategories(category.id)}><DeleteOutlined /></button>
          </div>
        ) }
      ]} dataSource={categories} />
      {isModalVisible && (
        <Modal title={editingCategory? "Editar categoría" : "Agregar categoría"} visible={isModalVisible} onOk={() => handleUpdateCategories} onCancel={() => setIsModalVisible(false)}>
          <Form>
            <Form.Item label="Imagen">
              <Input type="file" onChange={handleImageChange} />
            </Form.Item>
            <Form.Item label="Nombre">
              <Input name="name" value={formValues.name} onChange={(event) => setFormValues({...formValues, name: event.target.value })} required />
            </Form.Item>
            <Form.Item label="Descripcion">
              <Input name="description" value={formValues.description} onChange={(event) => setFormValues({...formValues, description: event.target.value })} required />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default CategoryTab