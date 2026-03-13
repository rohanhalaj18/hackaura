const cron = require("node-cron");
const Referral = require("../models/Referral");
const { sendSMS } = require("../services/smsService");

cron.schedule("0 * * * *", async () => {
  const referrals = await Referral.find({ status: "pending" });

  referrals.forEach(async (ref) => {
    await sendSMS(
      ref.patientPhone,
      "Reminder: Please visit hospital for your referral",
    );
  });
});
