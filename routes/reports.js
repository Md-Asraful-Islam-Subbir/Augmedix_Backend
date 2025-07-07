import express from "express";
import PatientReport from "../models/PatientReport.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      doctorName,
      phone,
      email,
      age,
      gender,
      lastVisit,
      procedure,
      image,
      transcription,
      audioUrl,
      notes,
      history,
      examFindings,
      prescriptions,
      documents,
      analysisResult
    } = req.body;

    const pushFields = {
      transcription: { $each: Array.isArray(transcription) ? transcription : [transcription] },
      audioUrl: { $each: Array.isArray(audioUrl) ? audioUrl : [audioUrl] },
      notes: { $each: Array.isArray(notes) ? notes : [notes] },
      history: { $each: Array.isArray(history) ? history : [history] },
      examFindings: { $each: Array.isArray(examFindings) ? examFindings : [examFindings] },
      prescriptions: { $each: prescriptions || [] },
      documents: { $each: documents || [] }
    };

    // Push new analysisResult if provided
    if (analysisResult?.input && analysisResult?.result) {
      pushFields.analysisResults = {
        input: analysisResult.input,
        result: analysisResult.result,
        date: new Date()
      };
    }

    const updatedReport = await PatientReport.findOneAndUpdate(
      { patientId },
      {
        $set: {
          patientName,
          doctorName,
          phone,
          email,
          age,
          gender,
          lastVisit,
          procedure,
          image
        },
        $push: pushFields
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "✅ Report updated", report: updatedReport });
  } catch (error) {
    console.error("❌ Error saving report:", error.message);
    res.status(500).json({ error: "Failed to save report", details: error.message });
  }
});

router.get("/by-patient-id/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const reports = await PatientReport.find({ patientId }).sort({ timestamp: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports by patient ID:", error);
    res.status(500).json({ error: "Failed to fetch reports by patient ID" });
  }
});

export default router;
