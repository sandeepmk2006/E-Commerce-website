import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        cartItems: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/cart', config);
        dispatch({ type: 'SET_CART', payload: data.cartItems });
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, qty) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post('/api/cart', { productId, qty }, config);
      dispatch({ type: 'SET_CART', payload: data.cartItems });
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(`/api/cart/${productId}`, config);
      dispatch({ type: 'SET_CART', payload: data.cartItems });
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  };

  const updateCartQuantity = async (productId, qty) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put('/api/cart', { productId, qty }, config);
      dispatch({ type: 'SET_CART', payload: data.cartItems });
    } catch (error) {
      console.error('Failed to update cart quantity', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart: state, addToCart, removeFromCart, updateCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
