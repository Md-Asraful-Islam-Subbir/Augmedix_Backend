import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  gender: { type: String, required: true },
  department: { type: String, required: true },
  doctor: { type: String, required: true },
  procedure: { type: String },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  serialNumber: { type: String },
  image: { type: String, required: false },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
