import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Input, Button, Avatar} from 'antd'
import { useParams } from 'react-router-dom'
import { DoubleRightOutlined } from '@ant-design/icons'

const Product = () => {
  const { id } = useParams()
  const token = localStorage.getItem('token');
  console.log("Token from localStorage:", token);
  const [productData, setProductData] = useState([])
  const [comments, setComments] = useState([])
  const [formComment, setFormComment] = useState({
    rating: 0,
    comment: '',
  })

  useEffect(() => {
    if (id){
      getProduct()
      getComments()
    }
  }, [id])

  const getProduct = async() =>{
    await axios.get(`http://api-proyecto-final.test/api/products/${id}`)
    .then(response => {
      setProductData(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const getComments = async() =>{
    await axios.get(`http://api-proyecto-final.test/api/comments-and-ratings/${id}`)
    .then(response => {
      setComments(response.data)
    })
    .catch(error => {
      console.error('There was an error!', error)
    })
  }

  const postComent = async() =>{
    let aux = {...formComment, product_id:id, customer_id:token.split('_')[1]}
    await axios.post(`http://api-proyecto-final.test/api/comments-and-ratings`, aux)
    .then(response => {
      setComments(...comments, response.data)
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
      </section>
      {comments.length !== 0 &&
        <section>
          {token &&
            <form onSubmit={postComent}>
              <Input name="rating" type='number' value={formComment.rating} onChange={(event) => setFormComment({...formComment, rating: event.target.value })} required />
              <Input name="comment" value={formComment.comment} onChange={(event) => setFormComment({...formComment, comment: event.target.value })}/>
              <Button type="submit"><DoubleRightOutlined /></Button>
            </form>
          }
          {comments.map((comment, index) => (
            <article>
              {comment.customer_picture?<img src={comment.customer_picture}/>:<Avatar/>}
              <h3>{comment.customer_name}</h3>
              <p>{comment.rating}/5</p>
              <p>{comment.comment}</p>
            </article>
          ))}
        </section>
      }
    </>
  )
}

export default Product