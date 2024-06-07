import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const RawCategory = ({ className }) => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/categories')
     .then(response => {
      console.log(response.data)
        setCategories(response.data);
      })
     .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div className={className}>
      <section className="categories">
        {categories?.map((category, index) => (
          <div className="category_card" onClick={() => navigate(`/products/list/${category.id}`)}>
            <img src={category.picture} alt={category.name} className="category_image" />
            <h2 className="category_name">{category.name}</h2>
            <div className="button-container">
              <button className="button">Ver Productos</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

const Category = styled(RawCategory)`
.categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 10px;
}

.category_card {
  flex: 1 0 22%;
  max-width: 22%;
  border: 1px solid #ddd;
  margin: 10px 0;
  padding: 10px;
  box-sizing: border-box;
  background-color: rgba(244, 235, 155, 0.75);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category_image {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 10px;
}

.category_name {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 10px;
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: auto;
}

.button {
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0056b3;
}
`;

export default Category;