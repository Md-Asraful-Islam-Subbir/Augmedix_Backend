import express from "express";
import Patient from "../models/Patient.js";
import axios from "axios";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

router.post("/patients", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();

   const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // 🔁 Use 587 instead of 465
  secure: false, // 🔁 false for STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    const mailOptions = {
      from: `"Augmedix" <${process.env.EMAIL_USER}>`,
      to: patient.email,
      subject: "Appointment Confirmation",
      html: `
        <h3>Hi ${patient.firstName} ${patient.lastName},</h3>
        <p>Your appointment has been confirmed with the following details:</p>
        <ul>
          <li><strong>Date:</strong> ${patient.appointmentDate}</li>
          <li><strong>Time:</strong> ${patient.appointmentTime}</li>
          <li><strong>Doctor:</strong> ${patient.doctor}</li>
          <li><strong>Department:</strong> ${patient.department}</li>
          <li><strong>Procedure:</strong> ${patient.procedure}</li>
          <li><strong>Serial Number:</strong> ${patient.serialNumber || "Not assigned"}</li>
        </ul>
        <p>Thank you for booking with us.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to", patient.email);

    res.status(201).json({ message: "Patient added and email sent!", patient });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to add patient or send email." });
  }
});
router.get("/patients", async (req, res) => {
    try {
      const patients = await Patient.find();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients." });
    }
  });
  router.post("/patients/:id/uploadImage", async (req, res) => {
    const { id } = req.params;
    const { image } = req.body; // Expect raw Base64 string

    if (!image) {
        return res.status(400).json({ message: "Image is required" });
    }

    try {
        const patient = await Patient.findById(id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // Send the image to Python server
        const pythonServerURL = "http://127.0.0.1:3000/api/face-recognition";
        const response = await axios.post(pythonServerURL, {
            image,  // Send raw Base64 data
            patientId: id,
        }, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Response from Python server:", response.data);
        if (response.data.match) {
            return res.json({
                message: "Patient recognized",
                patient: response.data,
            });
        } else {
            // Store new image if not recognized
            patient.image = image;
            await patient.save();

            return res.json({
                message: "New patient added, image saved",
                image,
            });
        }
    } catch (error) {
        console.error("Error processing image:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
  router.delete("/patients/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const patient = await Patient.findByIdAndDelete(id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
  
      res.json({ message: "Patient removed successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete patient." });
    }
  });
export default router;
