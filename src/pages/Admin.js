import React, { useState } from 'react'
import { Tabs } from 'antd'
import CustomerTab from '../adminSections/CustomerTab'
import CategoryTab from '../adminSections/CategoryTab'
import ProductTab from '../adminSections/ProductTab'
import UserTab from '../adminSections/UserTab'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('customers')
  const [userTypeAllow, setUserTypeAllow] = useState(null)
  const token = localStorage.getItem('token')
  setUserTypeAllow(token.charAt(0) === 'A')

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
        {userTypeAllow? (
          <Tabs.TabPane tab="Usuarios" key="users">
            <UserTab />
          </Tabs.TabPane>
        ) : null}
      </Tabs>
    </div>
  )
}

export default Admin