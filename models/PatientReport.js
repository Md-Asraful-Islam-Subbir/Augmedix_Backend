import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: String,
  date: String,
  url: String,
  filePath: String, // For filesystem storage
  fileData: Buffer, // For database storage
  mimetype: String
});

const prescriptionSchema = new mongoose.Schema({
  content: String,
  date: String,
  time: String,
  doctor: String,
  datetime: String,
});

const analysisResultSchema = new mongoose.Schema({
  input: String,
  result: String,
  date: { type: Date, default: Date.now }
});

const patientReportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: String,
  doctorName: String,
  contact: String,
  lastVisit: String,
  procedure: String,
  image: String,

  notes: [String],
  history: [String],
  transcription: [String],
  audioUrl: [String],
  examFindings: [String],

  analysisResults: [analysisResultSchema], // Store analysis history

  documents: [documentSchema],
  prescriptions: [prescriptionSchema],

  timestamp: { type: Date, default: Date.now }
});

const PatientReport = mongoose.model('PatientReport', patientReportSchema);

export default PatientReport;
