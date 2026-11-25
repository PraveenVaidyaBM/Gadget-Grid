import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

import users from "./data/users.js";

import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from './config/db.js';

dotenv.config();

const importData = async () => {
    try {
        const response = await fetch("https://dummyjson.com/products?limit=0");
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data.products)) {
            throw new Error("DummyJSON response did not contain a products array");
        }

        const electronicCategories = new Set([
            "smartphones",
            "laptops",
            "tablets",
            "mobile-accessories",
        ]);
        const products = data.products.filter((product) =>
            electronicCategories.has(product.category)
        );

        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();        
        const createdUsers = await User.insertMany(users);
        const createdUser = createdUsers[0]._id;
        const sampleProducts = products.map(product => {
            return {
                user: createdUser,
                name: product.title,
                image: product.thumbnail || product.images?.[0],
                description: product.description,
                brand: product.brand,
                category: product.category,
                price: product.price,
                countInStock: product.stock,
                rating: product.rating,
                numReviews: product.reviews?.length || 0,
            };
        });    
        await Product.insertMany(sampleProducts);
        console.log("Data Imported!".green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log("Data Destroyed!".red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
}

await connectDB();

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}