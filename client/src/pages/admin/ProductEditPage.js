import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (id !== 'new') {
      const fetchProduct = async () => {
        const { data } = await axios.get(`/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      };
      fetchProduct();
    }
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const product = { name, price, image, brand, category, countInStock, description };
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      if (id === 'new') {
        await axios.post('/api/products', product, config);
      } else {
        await axios.put(`/api/products/${id}`, product, config);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h1>{id === 'new' ? 'Create Product' : 'Edit Product'}</h1>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
      <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input type="number" placeholder="Count In Stock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
};

export default ProductEditPage;
