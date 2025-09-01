import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} />
      </Link>

      <div className="product-info">
        <Link to={`/product/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>

        <Rating value={product.rating} text={`${product.numReviews} reviews`} />

        <h4>${product.price}</h4>
      </div>
    </div>
  );
};

export default Product;
