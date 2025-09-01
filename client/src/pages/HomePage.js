import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/product/Product';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keywordFromUrl = params.get('keyword') || '';
    setKeyword(keywordFromUrl);

    const fetchProducts = async () => {
      const { data } = await axios.get(`/api/products?keyword=${keywordFromUrl}`);
      setProducts(data.products);
    };
    fetchProducts();
  }, [location.search]);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container">
      <h1>Latest Products</h1>
      <form onSubmit={searchHandler} className="search-box">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search Products..."
        />
        <button type="submit">Search</button>
      </form>
      <div className="products-grid">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
