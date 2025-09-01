import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderCancelPage from './pages/OrderCancelPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderListPage from './pages/admin/OrderListPage';
import CategoryListPage from './pages/admin/CategoryListPage.js';
import CategoryEditPage from './pages/admin/CategoryEditPage.js';
import UserListPage from './pages/admin/UserListPage.js';
import UserEditPage from './pages/admin/UserEditPage.js';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import AdminRoute from './components/admin/AdminRoute';

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <UserProvider>
      {/* <Elements stripe={stripePromise}> */}
        <CartProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/order-cancel" element={<OrderCancelPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="product/:id/edit" element={<ProductEditPage />} />
                <Route path="product/new" element={<ProductEditPage />} />
                <Route path="orders" element={<OrderListPage />} />
                <Route path="categories" element={<CategoryListPage />} />
                <Route path="category/:id/edit" element={<CategoryEditPage />} />
                <Route path="category/new" element={<CategoryEditPage />} />
                <Route path="users" element={<UserListPage />} />
                <Route path="user/:id/edit" element={<UserEditPage />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      {/* </Elements> */}
    </UserProvider>
  );
}

export default App;
