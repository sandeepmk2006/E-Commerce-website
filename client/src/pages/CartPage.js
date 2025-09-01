import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity } = useContext(CartContext);
  const { cartItems } = cart;
  const navigate = useNavigate();

  const removeFromCartHandler = (id) => {
    removeFromCart(id);
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/checkout');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.product.price, 0).toFixed(2);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="container">
      <h1 className="page-header">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Go Back</Link>
        </p>
      ) : (
        <div className="cart-container">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <img src={item.product.image} alt={item.product.name} />
                <div className="cart-item-details">
                  <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                  <div className="cart-item-price">${item.product.price}</div>
                  <div className="cart-item-qty">
                    Qty: 
                    <select
                      value={item.qty}
                      onChange={(e) => updateCartQuantity(item.product._id, Number(e.target.value))}
                    >
                      {[...Array(item.product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={() => removeFromCartHandler(item.product._id)} className="btn btn-danger">
                  <i className="fas fa-trash"></i> Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>${subtotal}</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>${subtotal}</span>
            </div>
            <button onClick={checkoutHandler} className="btn btn-primary btn-block" disabled={cartItems.length === 0}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
