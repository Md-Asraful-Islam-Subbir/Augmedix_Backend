import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config(); // Load environment variables

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Load from .env

router.post("/signup", async (req, res) => {
    const { name, email, password, userType } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role: userType });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password, userType } = req.body;

    try {
        const user = await User.findOne({ email, role: userType });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 900000; // 15 minutes

        await user.save();

        // Send email with reset token
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset",
            text: `To reset your password, click on the following link: http://localhost:5173/reset-password/${resetToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Error sending email" });
            }
            res.status(200).json({ message: "Password reset link sent to your email" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
// Fetch Logged-In Doctor's Information
router.get("/doctor/me", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const doctor = await User.findById(decoded.id).select("-password");

        if (!doctor || doctor.role !== "Admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(doctor); // Return doctor's information
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

export default router;
