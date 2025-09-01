import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import Rating from '../components/product/Rating';
import CartContext from '../context/CartContext';

const ProductPage = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(id, qty);
    navigate('/cart');
  };

  return (
    <div>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h3>${product.price}</h3>
      <Rating value={product.rating} text={`${product.numReviews} reviews`} />
      <p>Status: {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</p>
      {product.countInStock > 0 && (
        <div>
          <label>Qty</label>
          <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
            {[...Array(product.countInStock).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>
        </div>
      )}
      <button onClick={addToCartHandler} disabled={product.countInStock === 0}>
        Add To Cart
      </button>
    </div>
  );
};

export default ProductPage;
