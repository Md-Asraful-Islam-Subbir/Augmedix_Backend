import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  doctor: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  image: { type: String, required: false },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
