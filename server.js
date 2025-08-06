import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import gptRoute from "./routes/gpt.js";
import reportRoutes from "./routes/reports.js";
import documentRoutes from "./routes/documents.js";
import User from "./models/User.js";
import appointments from "./routes/appointments.js";
dotenv.config(); // Load .env variables

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Connect to MongoDB
connectDB();

// Seed Super Admin
const seedSuperAdmin = async () => {
  try {
    const exists = await User.findOne({ role: "Admin" });
    if (!exists) {
      const hashed = await bcrypt.hash("admin", 10);
      const admin = new User({
        name: "Super Admin",
        email: "admin@clinixnote.com",
        password: hashed,
        role: "Admin",
        isVerified: true,
      });
      await admin.save();
      console.log("✅ Super Admin seeded");
    } else {
      console.log("✅ Super Admin already exists");
    }
  } catch (err) {
    console.error("❌ Failed to seed Super Admin:", err);
  }
};
seedSuperAdmin();

// Route Setup
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/gpt", gptRoute);
app.use("/api/reports", reportRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/appointments", appointments);
// Test Route
app.get("/", (req, res) => {
  res.send("🚀 ClinixNote API is running");
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});
