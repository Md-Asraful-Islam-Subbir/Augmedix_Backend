import mongoose from 'mongoose';

const DoctorScheduleSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  days: [
    {
      day: String, 
      startTime: String, 
      endTime: String 
    }
  ],
  slotDuration: Number,
  validFrom: Date,
  validTo: Date
});

export default mongoose.model('DoctorSchedule', DoctorScheduleSchema);
