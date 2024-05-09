import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Admin = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    axios.get('/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleUpdateCustomers = (event) => {
    event.preventDefault();
    const { name, email, phone } = event.target.elements;
    axios.put(`/customers/${editingCustomer.id}`, { name: name.value, email: email.value, phone: phone.value })
      .then(response => {
        setIsModalVisible(false);
        setEditingCustomer(null);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleDeleteCustomers = (customerId) => {
    axios.delete(`/customers/${customerId}`)
      .then(response => {
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div>
      <h1>Gestión</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <button onClick={() => { setEditingCustomer(customer); setIsModalVisible(true); }}><EditOutlined /></button>
                <button onClick={() => handleDeleteCustomers(customer.id)}><DeleteOutlined /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && (
        <div>
          <h2>Editar cliente</h2>
          <form onSubmit={handleUpdateCustomers}>
            <label>
              Nombre:
              <input name="name" defaultValue={editingCustomer.name} required />
            </label>
            <label>
              Correo electrónico:
              <input name="email" defaultValue={editingCustomer.email} required />
            </label>
            <label>
              Teléfono:
              <input name="phone" defaultValue={editingCustomer.phone} required />
            </label>
            <button type="submit">Actualizar</button>
          </form>
          <button onClick={() => setIsModalVisible(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default Admin;