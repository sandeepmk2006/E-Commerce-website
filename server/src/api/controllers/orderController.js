import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: 'No order items in cart' });
    }

    // Calculate prices
    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example shipping logic
    const taxPrice = 0.15 * itemsPrice; // Example tax logic
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = new Order({
      orderItems: cart.cartItems.map(item => ({
        name: item.product.name,
        qty: item.qty,
        image: item.product.image,
        price: item.product.price,
        product: item.product._id,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice: itemsPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    });

    const createdOrder = await order.save();

    // Clear the cart
    cart.cartItems = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: 'Error creating order' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create stripe checkout session
// @route   POST /api/orders/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
    const { orderItems, success_url, cancel_url } = req.body;

    const line_items = orderItems.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: item.price * 100,
            },
            quantity: item.qty,
        };
    });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url,
            cancel_url,
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private
export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};
