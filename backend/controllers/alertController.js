const Alert = require("../models/Alert");

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ created_at: -1 }).limit(10);

    res.json(alerts);
  } catch (error) {
    res.status(500).json(error);
  }
};
