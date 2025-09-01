import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/admin/products" className="btn">Manage Products</Link>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/admin/categories" className="btn">Manage Categories</Link>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/admin/users" className="btn">Manage Users</Link>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/admin/orders" className="btn">View Orders</Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
