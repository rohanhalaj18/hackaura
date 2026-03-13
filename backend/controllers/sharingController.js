const Patient = require("../models/Patient");
const Symptom = require("../models/Symptom");
const Report = require("../models/Report");
const axios = require("axios");
const sendEmail = require("../services/emailService");

exports.sharePatientRecord = async (req, res) => {
  try {
    const { patient_id, recipient_email, include_ai_summary } = req.body;

    // 1. Fetch full data
    const patient = await Patient.findOne({ patient_id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const symptoms = await Symptom.find({ patient_id }).sort({ visit_date: -1 });
    const reports = await Report.find({ patient_id }).sort({ createdAt: -1 });

    // 2. Generate AI Summary if requested
    let aiSummary = "Clinical summary not requested.";
    if (include_ai_summary) {
      try {
        const symptomsText = symptoms.map(s => `[${new Date(s.visit_date).toLocaleDateString()}] ${s.symptoms.join(", ")}: ${s.notes || ""}`).join("\n");
        const reportsText = reports.map(r => `${r.report_type}: ${r.notes || ""}`).join("\n");

        const aiResponse = await axios.post("http://127.0.0.1:8000/analyze", {
          symptoms: symptomsText,
          reports: reportsText,
        });
        aiSummary = aiResponse.data.analysis;
      } catch (err) {
        aiSummary = "AI summary engine unavailable, but patient data is included below.";
      }
    }

    // 3. Construct Beautiful HTML Email
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; background: #fdfaf6; color: #1b1714; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.05); }
        .header { background: #181311; padding: 40px; text-align: center; }
        .header h1 { font-family: 'Sora', sans-serif; color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.02em; }
        .header p { color: #e8820c; font-weight: 700; margin-top: 8px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; }
        .content { padding: 40px; }
        .ai-box { background: #fdfaf6; border-left: 4px solid #e8820c; padding: 24px; border-radius: 0 16px 16px 0; margin-bottom: 32px; }
        .ai-box h2 { font-family: 'Sora', sans-serif; font-size: 18px; color: #e8820c; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px; }
        .ai-box p { font-size: 14px; line-height: 1.6; color: #4a4542; white-space: pre-wrap; margin: 0; }
        .section-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; border-bottom: 2px solid #f2f0ed; padding-bottom: 12px; margin-bottom: 16px; color: #181311; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .data-table th { text-align: left; font-size: 12px; color: #9c938b; padding-bottom: 8px; }
        .data-table td { font-size: 14px; padding: 12px 0; border-bottom: 1px solid #f2f0ed; }
        .badge { background: #f2f0ed; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; color: #e8820c; }
        .footer { background: #fbfaf8; padding: 30px; text-align: center; font-size: 12px; color: #9c938b; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Arogya-Vahini</h1>
          <p>Secure Medical Record Transmission</p>
        </div>
        <div class="content">
          <p style="margin-top:0;"><strong>Patient:</strong> ${patient.name} (${patient.gender}, ${patient.age})</p>
          <p><strong>Arogya ID:</strong> ${patient.patient_id}</p>
          
          <div class="ai-box">
            <h2>✨ AI Clinical Summary</h2>
            <p>${aiSummary.replace(/\n/g, "<br>")}</p>
          </div>

          <div class="section-title">Recent Clinical Logs</div>
          <table class="data-table">
            <thead>
              <tr><th>Date</th><th>Symptoms</th><th>Vitals</th></tr>
            </thead>
            <tbody>
              ${symptoms.slice(0, 5).map(s => `
                <tr>
                  <td>${new Date(s.visit_date).toLocaleDateString()}</td>
                  <td>${s.symptoms.join(", ")}</td>
                  <td>${s.blood_pressure || '--'} | ${s.temperature || '--'}°F</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="section-title">Latest Medical Reports</div>
          <table class="data-table">
            <thead>
              <tr><th>Type</th><th>Notes</th></tr>
            </thead>
            <tbody>
              ${reports.slice(0, 5).map(r => `
                <tr>
                  <td><span class="badge">${r.report_type}</span></td>
                  <td>${r.notes || "Stored in Health Vault"}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <p style="font-size: 13px; color: #9c938b; line-height: 1.6;">
            This document was generated and transmitted securely via the Arogya-Vahini Healthcare Platform. 
            <strong>Confidentiality Notice:</strong> This email contains protected health information.
          </p>
        </div>
        <div class="footer">
          &copy; 2026 Arogya-Vahini Digital Health Infrastructure <br>
          <em>Empowering healthcare through clinical intelligence.</em>
        </div>
      </div>
    </body>
    </html>
    `;

    // 4. Send Email
    await sendEmail(recipient_email, `Medical Record Summary: ${patient.name}`, html);

    res.json({ message: "Record successfully shared with " + recipient_email });
  } catch (error) {
    console.error("Share error:", error);
    res.status(500).json({ error: error.message });
  }
};
