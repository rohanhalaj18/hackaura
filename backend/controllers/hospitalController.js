const Hospital = require("../models/Hospital");

exports.createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);

    res.json(hospital);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();

    res.json(hospitals);
  } catch (error) {
    res.status(500).json(error);
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

exports.getNearbyHospitals = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const hospitals = await Hospital.find();

    const nearby = hospitals.map((h) => {
      const distance = calculateDistance(lat, lng, h.latitude, h.longitude);

      return {
        ...h._doc,
        distance,
      };
    });

    nearby.sort((a, b) => a.distance - b.distance);

    res.json(nearby.slice(0, 5));
  } catch (error) {
    res.status(500).json(error);
  }
};