import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import CustomerTab from '../adminSections/CustomerTab'
import CategoryTab from '../adminSections/CategoryTab'
import ProductTab from '../adminSections/ProductTab'
import UserTab from '../adminSections/UserTab'

const Admin = ({ className}) => {
  const [activeTab, setActiveTab] = useState('categories')
  const [userTypeAllow, setUserTypeAllow] = useState(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    setUserTypeAllow(token && token.charAt(0) === 'A')
  }, [token])

  return (
    <div className={className}>
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        <Tabs.TabPane tab="Categorías" key="categories">
          <CategoryTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Productos" key="products">
          <ProductTab />
        </Tabs.TabPane>
        {userTypeAllow && (
          <>
            <Tabs.TabPane tab="Clientes" key="customers">
              <CustomerTab />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Usuarios" key="users">
              <UserTab />
            </Tabs.TabPane>
          </>
        )}
      </Tabs>
    </div>
  )
}

export default Admin
