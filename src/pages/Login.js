import React, { useState } from 'react';
import { message } from "antd";
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({});
  const [register, setRegister] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState({});
  const [paymentMethodVisible, setPaymentMethodVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);

  const handleLogin = () => {
    axios.post('/login', credentials)
      .then(response => {
        message.success('Usuario verificado con exito')
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleRegister = () => {
    if (register.password !== register.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    axios.post('/register', register)
      .then(response => {
        message.success('Usuario registrado con exito')
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const handleAddPaymentMethod = () => {
    axios.post('/payment-methods', paymentMethod)
      .then(response => {
        setPaymentMethodVisible(false)
        message.success('Tarjeta registrada con exito')
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <>
      <h1>{registerVisible?'Registro':'Iniciar sesión'}</h1>

      {registerVisible?
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Nombre" onChange={e => setRegister({ ...register, name: e.target.value })} required />
          <input type="email" placeholder="Correo electrónico" onChange={e => setRegister({ ...register, email: e.target.value })} required />
          <input type="password" placeholder="Contraseña" onChange={e => setRegister({ ...register, password: e.target.value })} required />
          <input type="password" placeholder="Confirmar contraseña" onChange={e => setRegister({ ...register, confirmPassword: e.target.value })} required />
          <input type="tel" placeholder="Teléfono" onChange={e => setRegister({ ...register, phone: e.target.value })} required />
          <button onClick={setPaymentMethodVisible(true)}>Agregar metodo de pago</button>
          <button onClick={setRegisterVisible(false)}>Volver a login</button>
          <button type="submit">Registrarse</button>
        </form>
        :
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Correo electrónico" onChange={e => setCredentials({ ...credentials, email: e.target.value })} required />
          <input type="password" placeholder="Contraseña" onChange={e => setCredentials({ ...credentials, password: e.target.value })} required />
          <button onClick={setRegisterVisible(true)}>Crear cuenta</button>
          <button type="submit">Iniciar sesión</button>
        </form>
      }
      {paymentMethodVisible&&
        <div>
          <h1>Agregar método de pago</h1>
          <form onSubmit={handleAddPaymentMethod}>
            <input type="text" placeholder="Número de tarjeta" onChange={e => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })} required />
            <input type="text" placeholder="Fecha de vencimiento" onChange={e => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })} required />
            <input type="text" placeholder="CVV" onChange={e => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })} required />
            <input type="text" placeholder="Nombre del titular de la tarjeta" onChange={e => setPaymentMethod({ ...paymentMethod, cardHolderName: e.target.value })} required />
            <button type="submit">Agregar método de pago</button>
          </form>
        </div>
      }
    </>
  );
}

export default Login;