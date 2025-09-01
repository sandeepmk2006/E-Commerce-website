import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import User from './api/models/User.js';
import Product from './api/models/Product.js';
import Order from './api/models/Order.js';
import Category from './api/models/Category.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleCategories = [...new Set(products.map((p) => p.category))].map(
      (c) => ({ name: c })
    );
    const createdCategories = await Category.insertMany(sampleCategories);

    const sampleProducts = products.map((product) => {
      const category = createdCategories.find(
        (c) => c.name === product.category
      );
      return { ...product, user: adminUser, category: category._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
