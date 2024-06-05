import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Input, message, Avatar} from 'antd'
import { useParams } from 'react-router-dom'
import { DoubleRightOutlined, UserOutlined } from '@ant-design/icons'
import moment from 'moment/moment'

const Product = () => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [productData, setProductData] = useState([])
  const [comments, setComments] = useState([])
  const [peso, setPeso] = useState(0)
  const [formComment, setFormComment] = useState({
    rating: 0,
    title: '',
    comment: '',
  })

  useEffect(() => {
    if (id){
      getProduct()
      getComments()
    }
  }, [id])

  const getProduct = async() =>{
    await axios.get(`/products/${id}`)
    .then(response => {
      setProductData(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const getComments = async() =>{
    await axios.get(`/comments-and-ratings/${id}`)
    .then(response => {
      setComments(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const postComent = async() =>{
    let aux = {...formComment, product_id:id, customer_id:token.split('_')[1]}
    console.log(aux)
    await axios.post(`/comments-and-ratings`, aux)
    .then(response => {
      getComments()
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const manejarCambioPeso = (evento) => {
    setPeso(evento.target.value)
  }

  const agregarCarrito = async() => {
    await axios.get(`/orders/${token.split('_')[1]}/actual`)
    .then(response => {
      console.log(response.data)
      if (response.data.success){
        axios.post(`/order-details`, {order_id:response.data.order.id, product_id:id, quantity:peso, unit_price:productData.price})
        .then(response => {
          message.success('agregado al carrito')
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
      } else {
        axios.post(`/orders`, {customer_id:token.split('_')[1], order_date:moment().format('YYYY-MM-DD')})
        .then(response => {
          console.log(response.data)
          if (response.data){
            axios.post(`/order-details`, {order_id:response.data.id, product_id:id, quantity:peso, unit_price:productData.price})
            .then(response => {
              message.success('agregado al carrito')
            })
            .catch(error => {
              console.error('There was an error!', error)
            })
          }
        })
        .catch(error => {
          console.error('There was an error!', error)
        })
      }
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  return (
    <>
      <section>
        <img alt={productData.name} url={productData.name}/>
        <h2>{productData.name}</h2>
        <p>{productData.description}</p>
        <p>Price: {productData.price}</p>
        <label>
          Cantidad a comprar
          <select value={peso} onChange={manejarCambioPeso}>
            <option value={0}>0 kg</option>
            <option value={0.1}>100 g</option>
            <option value={0.25}>250 g</option>
            <option value={0.5}>500 g</option>
            <option value={1}>1 kg</option>
            <option value={2.5}>2.5 kg</option>
            <option value={3}>3 kg</option>
            <option value={5}>5 kg</option>
          </select>
        </label>
        <button onClick={(e)=>{e.preventDefault();agregarCarrito()}}>Agregar al carrito</button>
      </section>
      <section>
        {token &&
          <form>
            <Input name="rating" type='number' value={formComment.rating} onChange={(event) => setFormComment({...formComment, rating: event.target.value })} required />
            <Input name="title" value={formComment.title} onChange={(event) => setFormComment({...formComment, title: event.target.value })}/>
            <Input name="comment" value={formComment.comment} onChange={(event) => setFormComment({...formComment, comment: event.target.value })}/>
            <button onClick={(e)=>{e.preventDefault();postComent()}}><DoubleRightOutlined /></button>
          </form>
        }
        {comments.length !== 0 &&
          <>
            <h3>Comentarios</h3>
            {comments?.map((comment, index) => (
              <article>
                <Avatar
                  icon={!comment.picture || comment.picture === "data:application/x-empty;base64," ? <UserOutlined /> : null}
                  src={comment.picture && comment.picture !== "data:application/x-empty;base64," ? comment.picture : null}
                />
                <h5>{comment.customer_name}</h5>
                <p>{comment.rating}/5</p>
                <p>{comment.title}</p>
                <p>{comment.comment}</p>
              </article>
            ))}
          </>
        }
      </section>
    </>
  )
}

export default Product