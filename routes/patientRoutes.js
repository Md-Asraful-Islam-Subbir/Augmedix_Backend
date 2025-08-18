import express from "express";
import Patient from "../models/Patient.js";
import axios from "axios";
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js';
import QuickAppointment from '../models/QuickAppointment.js'; 
dotenv.config();
const router = express.Router();

router.post('/add/:appointmentId', authMiddleware, async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    // Find appointment
    const appointment = await QuickAppointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ contact: appointment.contact });
    if (!existingPatient) {
      // Create patient
      const newPatient = new Patient({
        name: appointment.name,
        contact: appointment.contact,
        doctor: appointment.doctor,
        appointmentDate: appointment.preferredDate,
        appointmentTime: appointment.preferredTime,
        image: ''
      });
      await newPatient.save();
    }

    // Mark as doctor confirmed
    appointment.doctorConfirmed = true;
    await appointment.save();

    res.json({ message: "Patient added successfully", doctorConfirmed: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/my-patients", authMiddleware, async (req, res) => {
  try {
    const doctorName = req.user.name; // from authMiddleware

    const patients = await Patient.find({ doctor: doctorName }).sort({
      appointmentDate: 1,
      appointmentTime: 1,
    });

    res.json(patients);
  } catch (error) {
    console.error("Error fetching doctor's patients:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Admin/global: Get all patients (unsorted or sorted globally)
 */
router.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find().sort({
      appointmentDate: 1,
      appointmentTime: 1,
    });
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients." });
  }
});

/**
 * Upload or verify patient image
 */
router.post("/patients/:id/uploadImage", async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const pythonServerURL = "http://127.0.0.1:3000/api/face-recognition";
    const response = await axios.post(
      pythonServerURL,
      { image, patientId: id },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.match) {
      return res.json({
        message: "Patient recognized",
        patient: response.data,
      });
    } else {
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

/**
 * Delete patient
 */
router.delete("/patients/:id", authMiddleware,async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json({ message: "Patient removed successfully!" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Failed to delete patient." });
  }
});
export default router;
