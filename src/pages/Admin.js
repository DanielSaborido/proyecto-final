import React, { useState } from 'react'
import { Tabs } from 'antd'
import CustomerTab from '../adminSections/CustomerTab'
import CategoryTab from '../adminSections/CategoryTab'
import ProductTab from '../adminSections/ProductTab'
import UserTab from '../adminSections/UserTab'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('customers')

  return (
    <div>
      <h1>Gestión</h1>
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        <Tabs.TabPane tab="Clientes" key="customers">
          <CustomerTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Categorías" key="categories">
          <CategoryTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Productos" key="products">
          <ProductTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Usuarios" key="users">
          <UserTab />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Admin