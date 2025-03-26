import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: String,
  lastName: String,
  dobDay: String,
  dobMonth: String,
  dobYear: String,
  gender: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  email: String,
  visitedBefore: String,
  department: String,
  doctor: String,
  procedure: String,
  appointmentDate: String,
  appointmentTime: String,
  serialNumber: String,
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment; 
