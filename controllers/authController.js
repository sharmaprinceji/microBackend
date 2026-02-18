import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await User.findOne({ email });

        if (exist)
            return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log("Login attempt:", { email, password });
        const user = await User.findOne({ email });
        // console.log("Found user:", user);
        if (!user)
            return res.status(400).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);

        if (!valid)
            return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        res.json({ token, user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
