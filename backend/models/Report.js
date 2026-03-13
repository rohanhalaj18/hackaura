const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: true,
    },

    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    report_type: {
      type: String,
    },

    file_url: {
      type: String,
    },

    notes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", reportSchema);
