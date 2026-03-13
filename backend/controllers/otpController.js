const Otp = require("../models/Otp");
const generateOtp = require("../utils/generateOtp");
const { sendSMS } = require("../services/smsService");

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  const otp = generateOtp();

  const expires = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.create({
    phone,
    otp,
    expiresAt: expires,
  });

  await sendSMS(phone, `Your Arogya OTP is ${otp}`);

  res.json({ message: "OTP sent" });
};
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const record = await Otp.findOne({ phone });

  if (!record) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone, role: "patient" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ token, user });
};