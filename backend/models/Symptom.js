const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: true,
    },

    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    symptoms: {
      type: [String],
    },

    temperature: Number,

    blood_pressure: String,

    notes: String,

    visit_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Symptom", symptomSchema);
