import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js"; 
import appointments from "./routes/appointments.js"; 
import patientRoutes from "./routes/patientRoutes.js"; 

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 4000; // Dynamic port for deployment

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend access

connectDB();

app.use("/api", authRoutes);
app.use("/api", doctorRoutes);
app.use("/api", appointments);
app.use("/api", patientRoutes);
app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
