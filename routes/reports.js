import express from "express";
import Patient from "../models/Patient.js";
import PatientReport from "../models/PatientReport.js";

const router = express.Router();

// Save or update patient report
router.post("/", async (req, res) => {
  try {
    const { patientId, notes, history, examFindings, transcription, audioUrl, prescriptions, documents, analysisResult } = req.body;

    const patient = await Patient.findOne({ id: patientId });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const pushFields = {};
    if (notes) pushFields.notes = Array.isArray(notes) ? notes : [notes];
    if (history) pushFields.history = Array.isArray(history) ? history : [history];
    if (examFindings) pushFields.examFindings = Array.isArray(examFindings) ? examFindings : [examFindings];
    if (transcription) pushFields.transcription = Array.isArray(transcription) ? transcription : [transcription];
    if (audioUrl) pushFields.audioUrl = Array.isArray(audioUrl) ? audioUrl : [audioUrl];
    if (prescriptions?.length) pushFields.prescriptions = prescriptions;
    if (documents?.length) pushFields.documents = documents;
    if (analysisResult?.input && analysisResult?.result) {
      pushFields.analysisResults = [{
        input: analysisResult.input,
        result: analysisResult.result,
        date: new Date()
      }];
    }

    const updatedReport = await PatientReport.findOneAndUpdate(
      { patientId },
      {
        $set: {
          patientName: patient.name,
          contact: patient.contact,
          doctorName: patient.doctor,
          lastVisit: patient.appointmentDate,
          procedure: "General Consultation",
          image: patient.image
        },
        $push: pushFields
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "✅ Report successfully updated or created",
      report: updatedReport
    });

  } catch (error) {
    console.error("❌ Error saving report:", error.message);
    res.status(500).json({ error: "Failed to save report", details: error.message });
  }
});

// Fetch all reports by patientId
router.get("/by-patient-id/:id", async (req, res) => {
  try {
    const reports = await PatientReport.find({ patientId: req.params.id }).sort({ timestamp: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports by patient ID:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

export default router;
