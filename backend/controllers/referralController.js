const Referral = require("../models/Referral");

exports.createReferral = async (req, res) => {
  try {
    const { patient_id, specialist, hospital_name, ai_summary } = req.body;

    const referral = await Referral.create({
      patient_id,
      doctor_id: req.user.id,
      specialist,
      hospital_name,
      ai_summary,
    });

    res.json(referral);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPatientReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({
      patient_id: req.params.patient_id,
    });

    res.json(referrals);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find();

    res.json(referrals);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateReferralStatus = async (req, res) => {
  try {
    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    res.json(referral);
  } catch (error) {
    res.status(500).json(error);
  }
};