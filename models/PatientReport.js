import mongoose from "mongoose";

const audioSchema = new mongoose.Schema({
  name: String,
  url: String,
  type: String,
  date: { type: Date, default: Date.now }
});
const historyEntrySchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
});

const examFindingSchema = new mongoose.Schema({
  finding: String,
  date: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: String,
  date: String,
  url: String,
  filePath: String,
  fileData: Buffer,
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
  patientId: { type: String, required: true },
  patientName: String,
  doctorName: String,
  contact: String,
  lastVisit: String,
  procedure: String,
  image: String,

  notes: [String],
  history: [historyEntrySchema],
  transcription: [String],
  examFindings: [examFindingSchema],

  audioUrl: [audioSchema],
  documents: [documentSchema],
  prescriptions: [prescriptionSchema],
  analysisResults: [analysisResultSchema],

  timestamp: { type: Date, default: Date.now }
});

const PatientReport = mongoose.model("PatientReport", patientReportSchema);
export default PatientReport;
