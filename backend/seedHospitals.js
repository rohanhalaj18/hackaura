const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Hospital = require("./models/Hospital");

const nipaniHospitals = [
  {
    name: "Geeta Nursing Home",
    latitude: 16.4128,
    longitude: 74.3800,
    specialties: ["General Medicine", "Nursing", "Maternity"],
    contact: "Nipani, Near Shah Udyog Bhavan, Karnataka 591237",
  },
  {
    name: "Nerli Hospital",
    latitude: 16.4141,
    longitude: 74.3832,
    specialties: ["General Surgery", "Orthopedics", "Family Medicine"],
    contact: "Ashoka Nagar, Near Post Office, Nipani, Karnataka 591237",
  },
  {
    name: "Akanksha Hospital",
    latitude: 16.4115,
    longitude: 74.3817,
    specialties: ["Gynecology", "Pediatrics", "General Medicine"],
    contact: "Nipani, Karnataka",
  },
  {
    name: "Lafayette Hospital",
    latitude: 16.4155,
    longitude: 74.3855,
    specialties: ["Emergency Care", "Internal Medicine"],
    contact: "Nipani, Karnataka",
  },
  {
    name: "Boodihal Cardiac & Diabetes Hospital",
    latitude: 16.4103,
    longitude: 74.3862,
    specialties: ["Cardiology", "Diabetology", "Endocrinology"],
    contact: "Near Khade Bazaar, Nipani",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Remove old entries to avoid duplicates
    await Hospital.deleteMany({ contact: { $regex: /Nipani/i } });
    console.log("Old Nipani hospitals cleared");

    const inserted = await Hospital.insertMany(nipaniHospitals);
    console.log(`✅ Inserted ${inserted.length} Nipani hospitals:`);
    inserted.forEach(h => console.log(`  - ${h.name} (${h.latitude}, ${h.longitude})`));
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Done.");
  }
}

seed();
