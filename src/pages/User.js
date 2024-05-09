import React, { useEffect, useState } from 'react';
import axios from 'axios';

function User() {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get('/users/{user_id}')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      <h1>Perfil</h1>
    </div>
  );
}

export default User;
