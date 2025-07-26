import express from "express";
import User from "../models/User.js";
import crypto from "crypto";
const router = express.Router();
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// API to get all doctors (users with role "Client")
router.get("/doctors", async (req, res) => {
    try {
        const doctors = await User.find({ role: "Admin" }).select("name");
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctors", error });
    }
});
router.get("/doctorsforappointment", async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor", status: "Approved" }).select("name specialization email");
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

router.post('/doctor/application', async (req, res) => {
  const { name, email, specialization } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already used." });
    }

    const newDoctor = new User({
      name,
      email,
      specialization,
      role: "Doctor",
      status: "Pending",
      emailVerifyToken: crypto.randomBytes(32).toString("hex"),
      emailVerifyExpires: Date.now() + 3600000
    });

    await newDoctor.save();

    res.status(201).json({ message: "Doctor application submitted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while submitting application." });
  }
});

router.get('/doctor/applications', async (req, res) => {
  try {
    const pendingDoctors = await User.find({ role: "Doctor", status: "Pending" });
    res.status(200).json(pendingDoctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctor applications." });
  }
});
router.post('/doctor/approve/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const doctor = await User.findById(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    if (doctor.status !== "Pending") return res.status(400).json({ message: "Doctor already processed." });

    const hashedPassword = await bcrypt.hash(password, 10);

    doctor.password = hashedPassword;
    doctor.status = "Approved";
    await doctor.save();

    // ✅ Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: doctor.email,
      subject: "ClinixNote Doctor Account Verification",
      html: `
        <h2>Welcome Dr. ${doctor.name}</h2>
        <p>Your application has been approved. Please verify your email to activate your account:</p>
        <a href="http://localhost:5173/verify-email/${doctor.emailVerifyToken}">Verify Email</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Doctor approved successfully. Verification email sent!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve doctor." });
  }
});

router.post('/doctor/decline/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await User.findById(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    if (doctor.status !== "Pending") return res.status(400).json({ message: "Doctor already processed." });

    doctor.status = "Rejected";

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Doctor application declined." });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Failed to decline doctor." });
  }
});


export default router;
