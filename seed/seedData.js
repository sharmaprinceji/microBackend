import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

dotenv.config();

await connectDB();

try {

    await User.deleteMany();
    await Product.deleteMany();

    const users = await User.insertMany([
        {
            name: "Test User",
            email: "user@test.com",
            password: await bcrypt.hash("123456", 10),
        },
        {
            name: "Admin",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 10),
        },
    ]);

    const products = Array.from({ length: 10 }).map((_, i) => ({
        title: `Product ${i + 1}`,
        price: (i + 1) * 100,
        description: `Description for product ${i + 1}`,
        image: `https://picsum.photos/200?random=${i + 1}`,
    }));

    await Product.insertMany(products);

    console.log("Seed data inserted successfully");

    process.exit();

} catch (error) {

    console.error(error);

    process.exit(1);
}
