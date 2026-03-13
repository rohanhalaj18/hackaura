const Patient = require("../models/Patient");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateQR = require("../utils/generateQR");
const { nanoid } = require("nanoid");

exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, email, aadhaar, blood_group, address } =
      req.body;

    const patient_id = "PAT-" + nanoid(8);

    const patient = await Patient.create({
      patient_id,
      name,
      age,
      gender,
      phone,
      email,
      aadhaar,
      blood_group,
      address,
      created_by: req.user.id,
    });

    // Check if the user login string already exists
    let user = await User.findOne({ email });
    if (!user) {
      const hashed = await bcrypt.hash("Password123", 10);
      user = await User.create({
        name,
        email,
        phone,
        aadhaar,
        password: hashed,
        role: "patient",
        verified: true,
      });
    }

    const qr = await generateQR(
      `http://localhost:5000/api/patients/${patient_id}`,
    );

    res.json({
      patient,
      qr,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();

    res.json(patients);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patient_id: req.params.id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { patient_id: req.params.id },
      req.body,
      { new: true },
    );

    res.json(patient);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await Patient.findOneAndDelete({
      patient_id: req.params.id,
    });

    res.json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const Symptom = require("../models/Symptom");
const Report = require("../models/Report");
const Referral = require("../models/Referral");

exports.getFullPatientProfile = async (req, res) => {
  try {
    const patient_id = req.params.id;

    const patient = await Patient.findOne({ patient_id });

    const symptoms = await Symptom.find({ patient_id });

    const reports = await Report.find({ patient_id });

    const referrals = await Referral.find({ patient_id });

    res.json({
      patient,
      symptoms,
      reports,
      referrals,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
