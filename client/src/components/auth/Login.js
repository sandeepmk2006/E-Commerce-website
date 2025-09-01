import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../../context/UserContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(redirect);
    } else {
      // Handle login error
      console.error('Login failed');
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          minLength="6"
          required
        />
        <input type="submit" value="Login" className="btn" />
      </form>
    </div>
  );
};

export default Login;
