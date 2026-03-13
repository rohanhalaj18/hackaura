const axios = require("axios");
const Alert = require("../models/Alert");

exports.analyzePatient = async (req, res) => {
  try {
    const { patient_id, symptoms, reports } = req.body;

    const response = await axios.post("http://127.0.0.1:8000/analyze", {
      symptoms,
      reports,
    });

    const analysis = response.data.analysis;

    // Determine risk level from analysis text
    let risk_level = "low";
    const lowerAnalysis = analysis.toLowerCase();

    if (lowerAnalysis.includes("high risk") || lowerAnalysis.includes("critical") || lowerAnalysis.includes("urgent")) {
      risk_level = "high";
    } else if (lowerAnalysis.includes("moderate") || lowerAnalysis.includes("medium risk") || lowerAnalysis.includes("follow up")) {
      risk_level = "medium";
    }

    // Auto-create alert for high risk patients
    if (risk_level === "high" && patient_id) {
      await Alert.create({
        patient_id,
        message: analysis,
        risk_level: "high",
      });
    }

    res.json({
      analysis,
      risk_level,
    });
  } catch (error) {
    console.error("AI analysis error:", error.message);
    res.status(500).json({ error: error.message || "AI service unavailable" });
  }
};