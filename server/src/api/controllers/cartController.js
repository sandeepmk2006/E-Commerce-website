import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'cartItems.product'
    );
    if (cart) {
      res.json(cart);
    } else {
      // If no cart, create one
      const newCart = await Cart.create({ user: req.user._id, cartItems: [] });
      res.json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add or update item in cart
// @route   POST /api/cart
// @access  Private
export const addOrUpdateCartItem = async (req, res) => {
  const { productId, qty } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.cartItems[itemIndex].qty = qty;
    } else {
      // Add new item
      cart.cartItems.push({ product: productId, qty });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('cartItems.product');
    res.status(201).json(populatedCart);

  } catch (error) {
    res.status(400).json({ message: 'Error adding to cart' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.cartItems = cart.cartItems.filter(
        (item) => item.product.toString() !== req.params.productId
      );
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('cartItems.product');
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

