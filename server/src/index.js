import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import productRoutes from './api/routes/productRoutes.js';
import authRoutes from './api/routes/authRoutes.js';
import categoryRoutes from './api/routes/categoryRoutes.js';
import orderRoutes from './api/routes/orderRoutes.js';
import cartRoutes from './api/routes/cartRoutes.js';

const startApp = async () => {
  dotenv.config();
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
      res.send('API is running...');
    });

    console.log('Loading routes...');
    app.use('/api/products', productRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/cart', cartRoutes);
    console.log('Routes loaded successfully.');

    let desiredPort = parseInt(process.env.PORT, 10) || 5000;
    const MAX_TRIES = 5;

    function startServer(port, attempt = 1) {
      const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempt < MAX_TRIES) {
          console.log(`Port ${port} in use. Trying ${port + 1}...`);
          startServer(port + 1, attempt + 1);
        } else {
          console.error('Failed to start server:', err.message);
          process.exit(1);
        }
      });
    }

    startServer(desiredPort);

  } catch (error) {
    console.error('Failed to initialize the application:', error);
    process.exit(1);
  }
};

startApp();

