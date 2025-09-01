import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import UserContext from '../../context/UserContext';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { cartItems } = cart;
  const { user, logout } = useContext(UserContext);

  return (
    <nav className="navbar">
      <div className="container">
        <h1>
          <Link to="/">E-Commerce</Link>
        </h1>
        <ul>
          <li>
            <Link to="/cart">
              <i className="fas fa-shopping-cart"></i> Cart (
              {cartItems.reduce((acc, item) => acc + item.qty, 0)})
            </Link>
          </li>
          {user ? (
            <>
              {user.role === 'admin' && (
                <li>
                  <Link to="/admin">Admin Dashboard</Link>
                </li>
              )}
              <li>
                <button onClick={logout} className="btn">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

