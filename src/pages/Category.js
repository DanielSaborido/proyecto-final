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
          <div key={index} className="category_card" onClick={() => navigate(`/products/list/${category.id}`)}>
            <img src={category.picture} alt={category.name} className="category_image" />
            <h2>{category.name}</h2>
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
  }

 .category_card {
    flex: 1 0 20%;
    border: 1px solid black;
    margin: 10px;
    padding: 10px;
    box-sizing: border-box;
  }

 .category_image {
    width: 100px;
    height: 100px;
  }
`;

export default Category;