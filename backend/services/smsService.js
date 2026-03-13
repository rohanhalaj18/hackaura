const axios = require("axios");

async function sendSMS(phone, message) {
  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: message,
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.SMS_API_KEY,
        },
      },
    );
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = sendSMS;

const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

async function sendWhatsApp(phone, message) {
  await client.messages.create({
    from: process.env.TWILIO_NUMBER,
    body: message,
    to: `whatsapp:+91${phone}`,
  });
}

module.exports = { sendSMS, sendWhatsApp };