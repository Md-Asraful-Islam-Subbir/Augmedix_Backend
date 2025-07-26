import express from "express";
const router = express.Router();
import QuickAppointment from "../models/QuickAppointment.js";

router.post("/quick-appointments", async (req, res) => {
  try {
     const { name, contact, doctor, preferredDate, preferredTime, saveInfo } = req.body;

    const newQuickAppointment = new QuickAppointment({
      name,
      contact,
       doctor,
      preferredDate,
      preferredTime,
      saveInfo,
    });

    await newQuickAppointment.save();
    res.status(201).json({ message: "Quick appointment created successfully" });
  } catch (error) {
    console.error("Error creating quick appointment:", error);
    res.status(500).json({ error: "Failed to create quick appointment" });
  }
});

export default router;
