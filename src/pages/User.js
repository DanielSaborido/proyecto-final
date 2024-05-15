import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User = ({userId}) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get(`/customers/${userId}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [userId]);

  return (
    <div>
      <h1>Perfil</h1>
    </div>
  );
}

export default User;
