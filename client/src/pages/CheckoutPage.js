import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import UserContext from '../context/UserContext';
import { loadStripe } from '@stripe/stripe-js';

const CheckoutPage = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const { cart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const { cartItems } = cart;
  const navigate = useNavigate();

  useEffect(() => {
    if (process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
      setStripePromise(loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };

      const { data: order } = await axios.post('/api/orders', {
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: stripePromise ? 'Stripe' : 'COD'
      }, config);

      if (!stripePromise) {
        navigate(`/order/${order._id}`);
        return;
      }

      const { data: session } = await axios.post(`/api/orders/${order._id}/create-checkout-session`, {}, config);
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error(result.error.message);
        setLoading(false);
      }

    } catch (err) {
      console.error('Checkout error', err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="checkout-form">
      <h2>Shipping</h2>
      <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
      <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
      <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
      <button type="submit" disabled={loading || cartItems.length === 0}>{loading ? 'Placing...' : 'Place Order'}</button>
    </form>
  );
};

export default CheckoutPage;
