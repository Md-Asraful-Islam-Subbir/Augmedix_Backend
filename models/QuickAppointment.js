import mongoose from "mongoose";

const quickAppointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    doctor: { 
      type: String, 
      required: true ,
    },
    preferredDate: {
      type: String, 
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    saveInfo: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const QuickAppointment = mongoose.model(
  "QuickAppointment",
  quickAppointmentSchema
);

export default QuickAppointment;
