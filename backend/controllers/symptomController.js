const Symptom = require("../models/Symptom");

exports.addSymptoms = async (req, res) => {
  try {
    const { patient_id, symptoms, temperature, blood_pressure, notes } =
      req.body;

    const record = await Symptom.create({
      patient_id,
      doctor_id: req.user.id,
      symptoms,
      temperature,
      blood_pressure,
      notes,
    });

    res.json(record);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPatientSymptoms = async (req, res) => {
  try {
    const records = await Symptom.find({
      patient_id: req.params.patient_id,
    });

    res.json(records);
  } catch (error) {
    res.status(500).json(error);
  }
};