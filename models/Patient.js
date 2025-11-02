import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const patientSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true }, // unique patient ID
  name: { type: String, required: true },
  contact: { type: String, required: true },
  doctor: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  image: { type: String, required: false },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;

