import React, { useState, useEffect } from 'react';
import API from '../../api';
import { Link } from 'react-router-dom';

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await API.delete(`/categories/${id}`, config);
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category', error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Categories</h1>
      <Link to="/admin/category/new" className="btn" style={{marginBottom: '1rem', display: 'inline-block'}}>Create Category</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>{category.name}</td>
              <td>
                <Link to={`/admin/category/${category._id}/edit`} className="btn">Edit</Link>
                <button onClick={() => deleteHandler(category._id)} className="btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryListPage;
