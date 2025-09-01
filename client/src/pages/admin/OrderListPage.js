import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const deliverHandler = async (id) => {
    if (window.confirm('Mark as delivered?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.put(`/api/orders/${id}/deliver`, {}, config);
        fetchOrders();
      } catch (error) {
        console.error('Failed to mark as delivered', error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user && order.user.name}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>${order.totalPrice}</td>
              <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
              <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
              <td>
                {!order.isDelivered && (
                  <button onClick={() => deliverHandler(order._id)} className="btn">Mark As Delivered</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListPage;
