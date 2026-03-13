const axios = require("axios");
const Patient = require("../models/Patient");
const Symptom = require("../models/Symptom");
const Report = require("../models/Report");

// POST /api/chat
exports.chat = async (req, res) => {
  try {
    const { message, session_id, patient_context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    let enrichedContext = patient_context || "";

    if (!patient_context) {
      // 1. Fetch all patients
      const patients = await Patient.find({}, "name age gender blood_group patient_id");

      // 2. Efficiently fetch symptoms and reports for ALL patients
      // We limit to most recent to prevent context overflow
      const patientDataPromises = patients.map(async (p) => {
        const latestSymptom = await Symptom.findOne({ patient_id: p.patient_id }).sort({ visit_date: -1 });
        const latestReport = await Report.findOne({ patient_id: p.patient_id }).sort({ createdAt: -1 });

        let summary = `[ID: ${p.patient_id}, Name: ${p.name}, Age: ${p.age}, Gender: ${p.gender}, Blood: ${p.blood_group}`;
        
        if (latestSymptom) {
          summary += `, Latest Symptoms: ${latestSymptom.symptoms.join(", ")}, BP: ${latestSymptom.blood_pressure}, Temp: ${latestSymptom.temperature}`;
        }
        
        if (latestReport) {
          summary += `, Latest Report: ${latestReport.report_type} (${latestReport.notes || "No notes"})`;
        }

        summary += `]`;
        return summary;
      });

      const patientSummaries = await Promise.all(patientDataPromises);
      enrichedContext = `GLOBAL PATIENT DATABASE (Include symptoms and reports):\n${patientSummaries.join("\n")}`;
    }

    const response = await axios.post("http://127.0.0.1:8000/chat", {
      message: message.trim(),
      session_id: session_id || "default",
      patient_context: enrichedContext,
    });

    res.json({ reply: response.data.reply });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({
      reply: "⚠ ArogyaBot is currently unavailable. Ensure the AI service is running on port 8000.",
    });
  }
};

// DELETE /api/chat/:sessionId
exports.clearSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await axios.delete(`http://127.0.0.1:8000/chat/${sessionId}`);
    res.json({ status: "cleared" });
  } catch (error) {
    res.json({ status: "cleared" });
  }
};
