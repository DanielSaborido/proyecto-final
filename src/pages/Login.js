import React, { useState } from 'react'
import { message } from "antd"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({email: '', password: ''})
  const [register, setRegister] = useState({ name: '', email: '', password: '', confirmPassword: '', address: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""})
  const [paymentMethodVisible, setPaymentMethodVisible] = useState(false)
  const [registerVisible, setRegisterVisible] = useState(false)

  const handleLogin = async(event) => {
    event.preventDefault();
    await axios.post('http://api-proyecto-final.test/api/login', credentials)
    .then(response => {
      localStorage.setItem('token', response.data.token)
      message.success('Usuario verificado con exito')
      navigate('/')
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const handleRegister = async(event) => {
    event.preventDefault();
    if (register.password !== register.confirmPassword) {
      message.error('Las contraseñas no coinciden')
      return
    }

    await axios.post('http://api-proyecto-final.test/api/register', register)
    .then(response => {
      localStorage.setItem('token', response.data.token)
      const { cardNumber, expiryDate, cvv} = paymentMethod
      if (cardNumber && expiryDate && cvv) {
        axios.post('http://api-proyecto-final.test/api/payment-methods', {...paymentMethod, customer_id: response.data.id})
        .then(response => {
          message.success('Usuario registrado con exito')
          navigate('/')
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
      } else{
        message.success('Usuario registrado con exito')
        navigate('/')
      }
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const handleAddPaymentMethod = (event) => {
    event.preventDefault()
    const { cardNumber, expiryDate, cvv } = paymentMethod
    if (!cardNumber || !expiryDate || !cvv) {
      message.error("Por favor, complete todos los campos")
      return
    }

    const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11})$/
    if (!cardNumberRegex.test(cardNumber)) {
      message.error("Número de tarjeta no válido")
      setPaymentMethod({ ...paymentMethod, cardNumber: '' })
      return
    }

    const expiryDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/
    if (!expiryDateRegex.test(expiryDate)) {
      message.error("Fecha de vencimiento no válida (MM/YY)")
      setPaymentMethod({ ...paymentMethod, expiryDate: '' })
      return
    }

    const cvvRegex = /^[0-9]{3,4}$/
    if (!cvvRegex.test(cvv)) {
      message.error("CVV no válido")
      setPaymentMethod({ ...paymentMethod, cvv: '' })
      return
    }
    setPaymentMethodVisible(false)
  }

  return (
    <>
      <h1>{registerVisible ? 'Registro' : 'Iniciar sesión'}</h1>

      {registerVisible ? (
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Nombre" onChange={e => setRegister({ ...register, name: e.target.value })} required />
          <input type="email" placeholder="Correo electrónico" onChange={e => setRegister({ ...register, email: e.target.value })} required />
          <input type="password" placeholder="Contraseña" onChange={e => setRegister({ ...register, password: e.target.value })} required />
          <input type="password" placeholder="Confirmar contraseña" onChange={e => setRegister({ ...register, confirmPassword: e.target.value })} required />
          <input type="tel" placeholder="Teléfono" onChange={e => setRegister({ ...register, phone: e.target.value })} />
          <input type="text" placeholder="Direccion" onChange={e => setRegister({ ...register, address: e.target.value })} />
          <button type="button" onClick={() => setPaymentMethodVisible(true)}>Agregar método de pago</button>
          <button type="button" onClick={() => setRegisterVisible(false)}>Volver a login</button>
          <button type="submit">Registrarse</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Correo electrónico" onChange={e => setCredentials({ ...credentials, email: e.target.value })} required />
          <input type="password" placeholder="Contraseña" onChange={e => setCredentials({ ...credentials, password: e.target.value })} required />
          <button type="button" onClick={() => setRegisterVisible(true)}>Crear cuenta</button>
          <button type="submit">Iniciar sesión</button>
        </form>
      )}
      {paymentMethodVisible && (
        <div>
          <h1>Agregar método de pago</h1>
          <form onSubmit={handleAddPaymentMethod}>
            <input type="text" placeholder="Número de tarjeta" onChange={e => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })} required />
            <input type="text" placeholder="Fecha de vencimiento" onChange={e => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })} required />
            <input type="text" placeholder="CVV" onChange={e => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })} required />
            <button type="submit">Agregar método de pago</button>
          </form>
        </div>
      )}
    </>
  )
}

export default Login