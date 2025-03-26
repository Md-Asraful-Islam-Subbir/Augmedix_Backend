import express from "express";
import User from "../models/User.js";

const router = express.Router();

// API to get all doctors (users with role "Client")
router.get("/doctors", async (req, res) => {
    try {
        const doctors = await User.find({ role: "Admin" }).select("name");
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctors", error });
    }
});

export default router;
