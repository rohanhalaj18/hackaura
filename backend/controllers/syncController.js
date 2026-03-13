const Patient = require("../models/Patient");
const Symptom = require("../models/Symptom");
const Report = require("../models/Report");

exports.syncData = async (req, res) => {
  try {
    const { patients, symptoms, reports } = req.body;

    if (patients && patients.length) {
      for (const p of patients) {
        await Patient.updateOne({ patient_id: p.patient_id }, p, {
          upsert: true,
        });
      }
    }

    if (symptoms && symptoms.length) {
      for (const s of symptoms) {
        await Symptom.create(s);
      }
    }

    if (reports && reports.length) {
      for (const r of reports) {
        await Report.create(r);
      }
    }

    res.json({
      message: "Sync completed",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
