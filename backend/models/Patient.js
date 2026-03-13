const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    age: Number,

    gender: String,

    phone: String,
    
    email: String,
    
    aadhaar: String,

    blood_group: String,

    address: String,

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Patient", patientSchema);
