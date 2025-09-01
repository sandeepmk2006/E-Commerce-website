import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    if (id !== 'new') {
      const fetchCategory = async () => {
        const { data } = await axios.get(`/api/categories/${id}`);
        setName(data.name);
      };
      fetchCategory();
    }
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const category = { name };
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      if (id === 'new') {
        await axios.post('/api/categories', category, config);
      } else {
        await axios.put(`/api/categories/${id}`, category, config);
      }
      navigate('/admin/categories');
    } catch (error) {
      console.error('Failed to save category', error);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>{id === 'new' ? 'Create Category' : 'Edit Category'}</h1>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
};

export default CategoryEditPage;
