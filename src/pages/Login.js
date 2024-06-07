import React, { useState } from 'react'
import { message } from "antd"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const RawLogin = ({ className }) => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({email: '', password: ''})
  const [image, setImage] = useState({
    name: '',
    base64: '',
  })
  const [register, setRegister] = useState({ name: '', email: '', password: '', confirmPassword: '', address: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState({
    card_number: null,
    expiry_date: null,
    cvv: null})
  const [paymentMethodVisible, setPaymentMethodVisible] = useState(false)
  const [registerVisible, setRegisterVisible] = useState(false)

  const handleLogin = async(event) => {
    event.preventDefault();
    await axios.post('/login', credentials)
    .then(response => {
      localStorage.setItem('token', response.data.token)
      message.success('Usuario verificado con exito')
      navigate('/')
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const handleRegister = async() => {
    if (register.password !== register.confirmPassword) {
      message.error('Las contraseñas no coinciden')
      return
    }

    axios.post('/customers', {...register, picture: image.base64})
    .then(response => {
      console.log(response.data)
      localStorage.setItem('token', response.data.token)
      const { cardNumber, expiryDate, cvv} = paymentMethod
      if (cardNumber && expiryDate && cvv) {
        axios.post('/payment-methods', {...paymentMethod, customer_id: response.data.customer.id})
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

  const handleAddPaymentMethod = () => {
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
    <div className={className}>
      <h1>{registerVisible ? 'Registro' : 'Iniciar sesión'}</h1>
      {registerVisible ? (
        <form>
          <div className="form-item">
            <label htmlFor="imagen">Imagen</label>
            <input type="file" id="imagen" onChange={handleImageChange} />
          </div>
          <div className="form-item">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" placeholder="Nombre" onChange={e => setRegister({ ...register, name: e.target.value })} required />
          </div>
          <div className="form-item">
            <label htmlFor="correo">Correo</label>
            <input type="email" id="correo" placeholder="Correo electrónico" onChange={e => setRegister({ ...register, email: e.target.value })} required />
          </div>
          <div className="form-item">
            <label htmlFor="password">contraseña</label>
            <input type="password" id="password" placeholder="Contraseña" onChange={e => setRegister({ ...register, password: e.target.value })} required />
          </div>
          <div className="form-item">
            <label htmlFor="password2">Confirmar Contraseña</label>
            <input type="password" id="password2" placeholder="Confirmar contraseña" onChange={e => setRegister({ ...register, confirmPassword: e.target.value })} required />
          </div>
          <div className="form-item">
            <label htmlFor="telefono">Telefono</label>
            <input type="tel" id="telefono" placeholder="Teléfono" onChange={e => setRegister({ ...register, phone: e.target.value })} />
          </div>
          <div className="form-item">
            <label htmlFor="direccion">Direccion</label>
            <input type="text" id="direccion" placeholder="Direccion" onChange={e => setRegister({ ...register, address: e.target.value })} />
          </div>
          <button type="button" onClick={() => setPaymentMethodVisible(true)}>Agregar método de pago</button>
          <button onClick={(e)=>{e.preventDefault();handleRegister()}}>Registrarse</button>
          <button type="button" onClick={() => setRegisterVisible(false)}>Volver a login</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="form-item">
            <label htmlFor="correo">Correo</label>
            <input type="email" id="correo" placeholder="Correo electrónico"  onChange={e => setCredentials({ ...credentials, email: e.target.value })} required />
          </div>
          <div className="form-item">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" placeholder="Contraseña" onChange={e => setCredentials({ ...credentials, password: e.target.value })} required />
          </div>
          <button type="submit">Iniciar sesión</button>
          <button type="button" onClick={() => setRegisterVisible(true)}>Crear cuenta</button>
        </form>
      )}
      {paymentMethodVisible && (
        <div>
          <h1>Agregar método de pago</h1>
          <form>
            <input type="text" placeholder="Número de tarjeta" onChange={e => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })} required />
            <input type="text" placeholder="Fecha de vencimiento" onChange={e => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })} required />
            <input type="text" placeholder="CVV" onChange={e => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })} required />
            <button onClick={(e)=>{e.preventDefault();handleAddPaymentMethod()}}>Agregar método de pago</button>
          </form>
        </div>
      )}
    </div>
  )
}

const Login = styled(RawLogin)`
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
`

export default Login