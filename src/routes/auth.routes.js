import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import redisClient from "../config/redis.js";

const router = express.Router();


router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        message: "User registered successfully",
        userId: user._id,
    });
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const sessionKey = `session:${user._id}`;

    await redisClient.hSet(sessionKey, {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        loginAt: new Date().toISOString(),
    });

    await redisClient.expire(sessionKey, 3600); // 1 hour

    res.json({
        message: "Login successful",
        userId: user._id,
    });
});

export default router;
