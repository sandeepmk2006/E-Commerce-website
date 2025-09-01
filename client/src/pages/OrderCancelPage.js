import React from 'react';
import { Link } from 'react-router-dom';

const OrderCancelPage = () => {
  return (
    <div>
      <h1>Order Cancelled</h1>
      <p>Your order has been cancelled. Please try again.</p>
      <Link to="/cart">Back to Cart</Link>
    </div>
  );
};

export default OrderCancelPage;
