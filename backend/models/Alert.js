const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
  },

  message: {
    type: String,
  },

  risk_level: {
    type: String,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Alert", alertSchema);
