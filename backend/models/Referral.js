const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: true,
    },

    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    specialist: {
      type: String,
    },

    hospital_name: {
      type: String,
    },

    ai_summary: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Referral", referralSchema);
