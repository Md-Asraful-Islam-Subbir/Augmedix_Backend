import express from "express";
const router = express.Router();
import Appointment from "../models/Appointment.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/appointments", authMiddleware,async (req, res) => {
  try {
    const userId=req.user._id;
    const newAppointment = new Appointment({
      ...req.body,
      userId, 
    });
    await newAppointment.save();
    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
});
router.get("/appointments", authMiddleware, async (req, res) => {
  try {
    const doctorName = req.user.name; // Get logged-in doctor's name from token

    // Find appointments where the doctor field matches the doctor's name
    const appointments = await Appointment.find({ doctor: doctorName });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});
router.get("/appointmentsClient", authMiddleware, async (req, res) => {
  try {
    const clientId = req.user._id; // Get logged-in doctor's name from token
console.log(clientId)
    // Find appointments where the doctor field matches the doctor's name
    const appointments = await Appointment.find({ userId: clientId });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});
router.put("/appointments/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentTime } = req.body;

    // Find the appointment by ID and update the appointment time
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { appointmentTime },
      { new: true } // Return the updated appointment
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment rescheduled successfully", updatedAppointment });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ error: "Failed to reschedule appointment" });
  }
});
router.put("/appointments/:id/serial", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { serialNumber } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { serialNumber },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Serial number updated successfully", updatedAppointment });
  } catch (error) {
    console.error("Error updating serial number:", error);
    res.status(500).json({ error: "Failed to update serial number" });
  }
});
router.delete("/appointments/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the appointment by ID
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

export default router;

