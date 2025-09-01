import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div>
      <h1>Order Successful!</h1>
      <p>Thank you for your purchase.</p>
      <Link to="/">Continue Shopping</Link>
    </div>
  );
};

export default OrderSuccessPage;
