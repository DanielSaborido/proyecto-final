import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <>
      <h1>Categorías</h1>
      <CategoryContainer>
        {categories.map((category, index) => (
          <CategoryCard key={index}>
            <CategoryImage src={category.image} alt={category.name} />
            <h2>{category.name}</h2>
          </CategoryCard>
        ))}
      </CategoryContainer>
    </>
  );
}

const CategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const CategoryCard = styled.div`
  flex: 1 0 20%;
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  box-sizing: border-box;
`;

const CategoryImage = styled.img`
  width: 100px;
  height: 100px;
`;

export default Category;