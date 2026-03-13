const QRCode = require("qrcode");

async function generateQR(data) {
  try {
    const qr = await QRCode.toDataURL(data);
    return qr;
  } catch (error) {
    console.error("QR generation error:", error);
  }
}

module.exports = generateQR;
