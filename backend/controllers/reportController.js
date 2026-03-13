const Report = require("../models/Report");

exports.uploadReport = async (req, res) => {
  try {
    const { patient_id, report_type, notes } = req.body;

    const report = await Report.create({
      patient_id,
      doctor_id: req.user.id,
      report_type,
      file_url: req.file.path,
      notes,
    });

    res.json(report);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPatientReports = async (req, res) => {
  try {
    const reports = await Report.find({
      patient_id: req.params.patient_id,
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json(error);
  }
};